import { UserRole } from "@prisma/client";

export type AuthRole = UserRole | "STUDENT";

export interface AuthUser {
  sub: number;
  id: number;
  enrollmentNo?: string;
  email?: string;
  role: AuthRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
