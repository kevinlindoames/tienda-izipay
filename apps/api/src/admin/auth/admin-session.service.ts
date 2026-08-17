import { createHash, randomBytes } from 'node:crypto';

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import type {
  AuthenticatedAdmin,
  IssuedAdminSession,
} from './admin-auth.types';

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

@Injectable()
export class AdminSessionService {
  constructor(private readonly prisma: PrismaService) {}

  async issue(adminId: string): Promise<IssuedAdminSession> {
    const token = randomBytes(32).toString('base64url');
    const tokenHash = hashSessionToken(token);
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

    await this.prisma.adminSession.create({
      data: {
        adminId,
        tokenHash,
        expiresAt,
      },
    });

    return {
      token,
      expiresAt,
    };
  }

  async authenticate(token: string): Promise<AuthenticatedAdmin | null> {
    if (!token) {
      return null;
    }

    const tokenHash = hashSessionToken(token);

    const session = await this.prisma.adminSession.findUnique({
      where: {
        tokenHash,
      },
      include: {
        admin: true,
      },
    });

    if (!session) {
      return null;
    }

    if (session.expiresAt.getTime() <= Date.now()) {
      await this.prisma.adminSession.deleteMany({
        where: {
          id: session.id,
        },
      });

      return null;
    }

    if (!session.admin.isActive) {
      return null;
    }

    await this.prisma.adminSession.update({
      where: {
        id: session.id,
      },
      data: {
        lastUsedAt: new Date(),
      },
    });

    return {
      sessionId: session.id,
      id: session.admin.id,
      email: session.admin.email,
      firstName: session.admin.firstName,
      lastName: session.admin.lastName,
      role: session.admin.role,
    };
  }

  async revoke(token: string): Promise<void> {
    if (!token) {
      return;
    }

    await this.prisma.adminSession.deleteMany({
      where: {
        tokenHash: hashSessionToken(token),
      },
    });
  }

  async revokeAllForAdmin(adminId: string): Promise<void> {
    await this.prisma.adminSession.deleteMany({
      where: {
        adminId,
      },
    });
  }
}
