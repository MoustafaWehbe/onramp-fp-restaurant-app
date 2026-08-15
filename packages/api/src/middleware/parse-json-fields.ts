import type { Request, Response, NextFunction } from "express";
import createError from "http-errors";

export const parseJsonFields = (...fields: string[]) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    for (const field of fields) {
      if (typeof req.body?.[field] !== "string") continue;

      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch {
        return next(createError(400, `Invalid JSON in field "${field}"`));
      }
    }

    next();
  };
};