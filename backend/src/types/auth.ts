import { Request } from "express";

export interface AuthUser {
  id: number;
  enrollmentNo: string;
  email: string;
  role: "STUDENT" | "STAFF";
}

export interface AuthRequest extends Request {
  user: AuthUser;
}
