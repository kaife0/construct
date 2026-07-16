import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const BCRYPT_ROUNDS = 12;
const TOKEN_EXPIRY = "7d";
export const SESSION_COOKIE_NAME = "casastruct_admin_session";
export const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days, matches TOKEN_EXPIRY

export function hashPassword(plain: string) {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export type SessionPayload = { sub: string; email: string };

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "JWT_SECRET is not set (or too short). Generate one with `openssl rand -base64 32` and add it to .env."
    );
  }
  return secret;
}

export function signSession(payload: SessionPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: TOKEN_EXPIRY, algorithm: "HS256" });
}

export function verifySession(token: string): SessionPayload {
  return jwt.verify(token, getJwtSecret(), { algorithms: ["HS256"] }) as SessionPayload;
}
