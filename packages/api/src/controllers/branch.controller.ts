import type { Request, Response, NextFunction } from "express";
import { branchService } from "../services/branch.service";
import { branchIdSchema } from "../schemas/branch.schema";

export const branchController = {
    async getById(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { branchId } = branchIdSchema.parse(req.params);

            const branch = await branchService.getBranchById(branchId);

            res.status(200).json({
                message: "Branch details retrieved successfully",
                data: branch,
            });
        } catch (err) {
            next(err);
        }
    },
};