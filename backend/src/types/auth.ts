import { Request } from "express";

export interface AuthUser {
  sub: number;
  id: number;
  enrollmentNo: string;
  email: string;
  role: "STUDENT" | "STAFF";
}

export interface AuthRequest extends Request {
  user: AuthUser;
}
