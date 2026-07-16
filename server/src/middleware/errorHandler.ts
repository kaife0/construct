import type { NextFunction, Request, Response } from "express";

/** Terminal error middleware — catches anything asyncHandler-wrapped routes forward via next(err). */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (res.headersSent) return;

  const name = (err as { name?: string })?.name;
  if (name === "CastError") {
    res.status(400).json({ error: "Invalid id." });
    return;
  }
  if (name === "ValidationError") {
    res.status(400).json({ error: "Invalid data." });
    return;
  }

  console.error("[server] unhandled error:", err);
  res.status(500).json({ error: "Something went wrong. Please try again." });
}
