import { verifyAccessToken } from "@starter-kit/shared";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function opitonalAuthenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.accessToken;

    if(!token) {
        return next();
    }

    try {
        req.user = verifyAccessToken(token);
        next();
    } catch {
        req.user = undefined;
        next();
    }
}