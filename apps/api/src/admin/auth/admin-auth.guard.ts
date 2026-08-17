import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

import type { AdminAuthenticatedRequest } from './admin-auth.types';
import { AdminSessionService } from './admin-session.service';

export function extractBearerToken(
  authorization: string | undefined,
): string | null {
  if (!authorization) {
    return null;
  }

  const match = /^Bearer\s+(.+)$/i.exec(authorization.trim());

  if (!match?.[1]) {
    return null;
  }

  return match[1].trim();
}

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly sessions: AdminSessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = extractBearerToken(request.headers.authorization);

    if (!token) {
      throw new UnauthorizedException('Authentication required.');
    }

    const admin = await this.sessions.authenticate(token);

    if (!admin) {
      throw new UnauthorizedException('Authentication required.');
    }

    const authenticatedRequest = request as AdminAuthenticatedRequest;

    authenticatedRequest.admin = admin;
    authenticatedRequest.adminSessionToken = token;

    return true;
  }
}
