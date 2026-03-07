import { compare, hash } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "./db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

// Verify password
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

// Create JWT token
export async function createToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

// Verify JWT token
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

// Create session
export async function createSession(userId: string, email: string, role: string) {
  const token = await createToken({ userId, email, role });
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  // Save session to database
  await db.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  // Set cookie
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return token;
}

// Get current session
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  // Check if session exists in database
  const session = await db.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    // Session expired or doesn't exist
    await deleteSession();
    return null;
  }

  return payload;
}

// Delete session
export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (token) {
    await db.session.delete({
      where: { token },
    }).catch(() => {});
  }

  cookieStore.delete("session");
}

// Get current user
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      plan: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  return user;
}

// Require authentication
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

// Require admin
export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
  return user;
}
