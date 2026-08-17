import type { Request } from 'express';

import type { AdminRole } from '../../generated/prisma/client';

export interface SafeAdmin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
}

export interface AuthenticatedAdmin extends SafeAdmin {
  sessionId: string;
}

export interface AdminAuthenticatedRequest extends Request {
  admin: AuthenticatedAdmin;
  adminSessionToken: string;
}

export interface IssuedAdminSession {
  token: string;
  expiresAt: Date;
}
