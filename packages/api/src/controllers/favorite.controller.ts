import { favoriteService } from "src/services/favorite.service";
import type { Request, Response, NextFunction } from "express";

type FavoriteParams = {
  restaurantSlug: string;
};


export const favoriteController = {
    create: async (req: Request<FavoriteParams>, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId;

            if(!userId) {
                return next();
            }

            const { restaurantSlug } = req.params;

            const favorite = await favoriteService.create(userId, restaurantSlug);

            res.status(201).json({
                data: favorite,
                message: "Restaurant added to favorites",
            });
        } catch(error) {
            next(error);
        }
    },

    delete: async (req: Request<FavoriteParams>, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId;

            if(!userId) {
                return next();
            }

            const { restaurantSlug } = req.params;

            await favoriteService.delete(userId, restaurantSlug);

            res.status(200).json({
                message: "Restaurant removed from your favorites list",
            });
        } catch(error) {
            next(error);
        }
    },

    getFavorites: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId;

            if(!userId) {
                return next();
            }

            const favorites = await favoriteService.getFavorites(userId);

            res.status(200).json({
                data: favorites,
                message: "Favorites retrieved successfully",
            });
        } catch(error) {
            next(error);
        }
    },
}