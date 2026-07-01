import { UserRole } from '@prisma/client';
import { Request } from 'express';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isDemo: boolean;
  emailVerifiedAt: Date | null;
  isTwoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthenticatedRequest = Request & {
  user: AuthUser;
};
