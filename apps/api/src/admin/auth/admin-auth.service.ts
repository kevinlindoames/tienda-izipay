import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AdminUsersService } from '../admin-users.service';
import type { SafeAdmin } from './admin-auth.types';
import { AdminSessionService } from './admin-session.service';
import type { AdminLoginDto } from './dto/admin-login.dto';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly adminUsers: AdminUsersService,
    private readonly sessions: AdminSessionService,
  ) {}

  async login(dto: AdminLoginDto): Promise<{
    admin: SafeAdmin;
    sessionToken: string;
    expiresAt: string;
  }> {
    const email = dto.email.trim().toLowerCase();

    const admin = await this.adminUsers.findByEmail(email);

    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const matches = await bcrypt.compare(dto.password, admin.passwordHash);

    if (!matches) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const session = await this.sessions.issue(admin.id);

    return {
      admin: {
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
      },
      sessionToken: session.token,
      expiresAt: session.expiresAt.toISOString(),
    };
  }
}
