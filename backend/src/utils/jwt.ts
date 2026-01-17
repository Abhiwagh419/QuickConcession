import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = "1d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export type UserRole = "STUDENT" | "STAFF";

export interface AppJwtPayload {
  sub: number;
  role: UserRole;
}

export function signJwt(payload: AppJwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyJwt(token: string): AppJwtPayload {
  const decoded = jwt.verify(token, JWT_SECRET) as unknown;

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    !("sub" in decoded) ||
    !("role" in decoded)
  ) {
    throw new Error("Invalid JWT payload");
  }

  const { sub, role } = decoded as {
    sub: unknown;
    role: unknown;
  };

  if (typeof sub !== "number") {
    throw new Error("Invalid JWT subject");
  }

  if (role !== "STUDENT" && role !== "STAFF") {
    throw new Error("Invalid JWT role");
  }

  return { sub, role };
}
