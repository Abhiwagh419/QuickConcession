import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = "1d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export type UserRole = "STUDENT" | "STAFF" | "ADMIN";

export interface AppJwtPayload {
  sub: number;
  id: number;
  role: UserRole;   // ✅ FIXED
  email?: string;
  name?: string;
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
    !("id" in decoded) ||
    !("role" in decoded)
  ) {
    throw new Error("Invalid JWT payload");
  }

  const { sub, id, role, email, name } = decoded as {
    sub: unknown;
    id: unknown;
    role: unknown;
    email?: unknown;
    name?: unknown;
  };

  if (typeof sub !== "number" || typeof id !== "number") {
    throw new Error("Invalid JWT subject");
  }

  if (role !== "STUDENT" && role !== "STAFF" && role !== "ADMIN") {
    throw new Error("Invalid JWT role");
  }

  return {
  sub,
  id,
  role: role as UserRole,
  email: typeof email === "string" ? email : undefined,
  name: typeof name === "string" ? name : undefined,
};
}

