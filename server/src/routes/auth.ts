import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { AdminUser } from "../models/index.js";
import { verifyPassword, signSession, SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS } from "../lib/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again in a few minutes." },
});

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

router.post("/login", loginLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Enter a valid email and password." });
    return;
  }
  const { email, password } = parsed.data;

  // Same generic error whether the email doesn't exist or the password is
  // wrong — never reveal which, to avoid leaking valid admin emails.
  const genericError = () => res.status(401).json({ error: "Invalid email or password." });

  const user = await AdminUser.findOne({ email });
  if (!user) {
    genericError();
    return;
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    genericError();
    return;
  }

  const token = signSession({ sub: user.id, email: user.email });
  res.cookie(SESSION_COOKIE_NAME, token, { ...cookieOptions, maxAge: SESSION_MAX_AGE_MS });
  res.json({ name: user.name, email: user.email });
});

router.post("/logout", (_req, res) => {
  res.clearCookie(SESSION_COOKIE_NAME, cookieOptions);
  res.json({ ok: true });
});

router.get("/me", requireAdmin, async (req, res) => {
  const user = await AdminUser.findById(req.admin!.sub);
  if (!user) {
    res.status(401).json({ error: "Session no longer valid." });
    return;
  }
  res.json({ name: user.name, email: user.email });
});

export default router;
