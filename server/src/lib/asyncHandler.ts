import type { NextFunction, Request, RequestHandler, Response } from "express";

/** Wraps an async route handler so a rejected promise reaches Express's error middleware instead of hanging the request. */
export function ah(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
