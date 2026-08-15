import type { Request, Response, NextFunction } from "express";

export const parseJsonFields = (...fields: string[]) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            for (const field of fields) {
                if(typeof req.body?.[field] === "string") {
                    req.body[field] = JSON.parse(req.body[field]);
                }
            }

            next();
        } catch (error) {
            next(error);
        }
    }
}