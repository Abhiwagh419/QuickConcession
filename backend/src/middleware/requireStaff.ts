import { Request, Response, NextFunction } from "express";

export function requireStaff(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthenticated",
    });
  }

  if (req.user.role !== "STAFF") {
    return res.status(403).json({
      message: "Staff access required",
    });
  }

  next();
}
