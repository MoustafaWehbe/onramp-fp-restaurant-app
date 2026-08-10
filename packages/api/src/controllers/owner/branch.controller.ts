import type { Request, Response, NextFunction } from "express";
import { branchService } from "src/services/owner/branch.service";
type BranchParams = {
    restaurantId: string;
    branchId: string;
};

export const branchController = {
    create: async (
        req: Request<BranchParams>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { restaurantId } = req.params;

            const {
                name,
                city,
                address,
                latitude,
                longitude,
                phone,
                opening_hours,
                images,
            } = req.body;
            const branch = await branchService.create({
                restaurantId,
                name,
                city,
                address,
                latitude,
                longitude,
                phone,
                opening_hours,
                images,
            });

            res.status(201).json({
                data: branch,
                message: "Branch created successfully",
            });
        } catch (error) {
            next(error);
        }
    },
    update: async (
        req: Request<{
            restaurantId: string;
            branchId: string;
        }>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { restaurantId, branchId } = req.params;

            const branch = await branchService.update(
                restaurantId,
                branchId,
                req.body,
            );

            res.status(200).json({
                data: branch,
                message: "Branch updated successfully",
            });
        } catch (error) {
            next(error);
        }
    },

    delete: async (
        req: Request<{
            restaurantId: string;
            branchId: string;
        }>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { restaurantId, branchId } = req.params;

            await branchService.delete(
                restaurantId,
                branchId,
            );

            res.status(200).json({
                message: "Branch deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    },

    getAll: async (
        req: Request<{ restaurantId: string }>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { restaurantId } = req.params;

            const branches = await branchService.getAll(restaurantId);

            res.status(200).json({
                data: branches,
                message: "Branches retrieved successfully",
            });
        } catch (error) {
            next(error);
        }
    },

    getById: async (
        req: Request<{
            restaurantId: string;
            branchId: string;
        }>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { restaurantId, branchId } = req.params;

            const branch = await branchService.getById(
                restaurantId,
                branchId,
            );

            res.status(200).json({
                data: branch,
                message: "Branch retrieved successfully",
            });
        } catch (error) {
            next(error);
        }
    },
};