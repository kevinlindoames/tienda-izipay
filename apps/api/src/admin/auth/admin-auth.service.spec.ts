import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AdminRole } from '../../generated/prisma/client';
import { AdminUsersService } from '../admin-users.service';
import { AdminAuthService } from './admin-auth.service';
import { AdminSessionService } from './admin-session.service';

describe('AdminAuthService', () => {
  const adminUsers = {
    findByEmail: jest.fn(),
  };

  const sessions = {
    issue: jest.fn(),
  };

  const service = new AdminAuthService(
    adminUsers as unknown as AdminUsersService,
    sessions as unknown as AdminSessionService,
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates a session after valid credentials', async () => {
    const passwordHash = await bcrypt.hash('correct-password', 4);

    adminUsers.findByEmail.mockResolvedValue({
      id: 'admin-1',
      email: 'admin@example.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'Principal',
      role: AdminRole.OWNER,
      isActive: true,
    });

    sessions.issue.mockResolvedValue({
      token: 'opaque-session-token',
      expiresAt: new Date('2030-01-01T00:00:00.000Z'),
    });

    await expect(
      service.login({
        email: 'ADMIN@example.com',
        password: 'correct-password',
      }),
    ).resolves.toEqual({
      admin: {
        id: 'admin-1',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'Principal',
        role: AdminRole.OWNER,
      },
      sessionToken: 'opaque-session-token',
      expiresAt: '2030-01-01T00:00:00.000Z',
    });
  });

  it('uses a generic error for an unknown administrator', async () => {
    adminUsers.findByEmail.mockResolvedValue(null);

    await expect(
      service.login({
        email: 'missing@example.com',
        password: 'password',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('uses a generic error for an invalid password', async () => {
    const passwordHash = await bcrypt.hash('correct-password', 4);

    adminUsers.findByEmail.mockResolvedValue({
      id: 'admin-1',
      email: 'admin@example.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'Principal',
      role: AdminRole.OWNER,
      isActive: true,
    });

    await expect(
      service.login({
        email: 'admin@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
