import type { Request, Response, NextFunction } from "express";
import { branchService } from "../services/branch.service";

export const branchController = {
    async getById(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const branchId = req.params.branchId as string;

            const branch = await branchService.getById(branchId);

            res.status(200).json({
                message: "Branch details retrieved successfully",
                data: branch,
            });
        } catch (err) {
            next(err);
        }
    },
};