import type { Request, Response, NextFunction } from "express";
import { SESSION_COOKIE_NAME, verifySession, type SessionPayload } from "../lib/auth.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: SessionPayload;
    }
  }
}

/** Gate for every admin-only route — verifies the session cookie's JWT. */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[SESSION_COOKIE_NAME];
  if (!token) {
    res.status(401).json({ error: "Not authenticated." });
    return;
  }

  try {
    req.admin = verifySession(token);
    next();
  } catch {
    res.status(401).json({ error: "Session expired or invalid." });
  }
}
