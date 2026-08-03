import { menuService } from "src/services/menu.service";
import { Request, Response, NextFunction } from "express";

type MenuParams = {
    id: string;
};

export const menuController = {
    getMenuById: async (req: Request<MenuParams>, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            const menu = await menuService.getMenuById(id);

            res.status(200).json({
                data: menu,
                message: "Menu retreived successfully",
            });
        } catch(error) {
            next(error);
        }
    } 
}