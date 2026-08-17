import { Module } from '@nestjs/common';

import { AdminUsersService } from './admin-users.service';
import { AdminAuthController } from './auth/admin-auth.controller';
import { AdminAuthGuard } from './auth/admin-auth.guard';
import { AdminAuthService } from './auth/admin-auth.service';
import { AdminSessionService } from './auth/admin-session.service';

@Module({
  controllers: [AdminAuthController],
  providers: [
    AdminUsersService,
    AdminAuthService,
    AdminSessionService,
    AdminAuthGuard,
  ],
  exports: [AdminAuthGuard, AdminSessionService],
})
export class AdminModule {}
