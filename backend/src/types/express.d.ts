import { Student } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
        enrollmentNo: string;
        email: string;
      };
    }
  }
}

export {};
