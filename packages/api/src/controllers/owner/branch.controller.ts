import type { Request, Response, NextFunction } from "express";
import { branchService } from "src/services/owner/branch.service";

type BranchParams = {
    restaurantSlug: string;
    branchSlug: string;
};

export const branchController = {
    create: async (
        req: Request<{ restaurantSlug: string }>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { restaurantSlug } = req.params;

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
                restaurantSlug,
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
        req: Request<BranchParams>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const {
                restaurantSlug,
                branchSlug,
            } = req.params;

            const branch = await branchService.update(
                restaurantSlug,
                branchSlug,
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
        req: Request<BranchParams>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const {
                restaurantSlug,
                branchSlug,
            } = req.params;

            await branchService.delete(
                restaurantSlug,
                branchSlug,
            );

            res.status(200).json({
                message: "Branch deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    },

    getAll: async (
        req: Request<{ restaurantSlug: string }>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { restaurantSlug } = req.params;

            const branches =
                await branchService.getAll(
                    restaurantSlug,
                );

            res.status(200).json({
                data: branches,
                message: "Branches retrieved successfully",
            });
        } catch (error) {
            next(error);
        }
    },

    getBySlug: async (
        req: Request<BranchParams>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const {
                restaurantSlug,
                branchSlug,
            } = req.params;

            const branch =
                await branchService.getBySlug(
                    restaurantSlug,
                    branchSlug,
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