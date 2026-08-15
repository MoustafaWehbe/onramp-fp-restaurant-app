import { Request, Response, NextFunction } from "express";
import { locationService } from "src/services/owner/location.service";

export const locationController = {
    resolveGoogleMaps: async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const restaurantSlug =
                req.params.restaurantSlug as string;

            const { url } = req.body;

            const location =
                await locationService.resolveGoogleMaps({
                    restaurantSlug,
                    url,
                });

            res.status(200).json({
                success: true,
                data: location,
            });
        } catch (error) {
            next(error);
        }
    },
};