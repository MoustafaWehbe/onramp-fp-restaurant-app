import { menuService } from "src/services/menu.service";
import { Request, Response, NextFunction } from "express";

type MenuParams = {
    id: string;
};
type BranchMenuParams = {
    branchSlug: string;
    menuId: string;
};
export const menuController = {
    getMenuByIdForBranch: async (
        req: Request<BranchMenuParams>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { branchSlug, menuId } = req.params;

            const menu = await menuService.getMenuByIdForBranch(
                menuId,
                branchSlug
            );

            res.status(200).json({
                data: menu,
                message: "Branch menu retrieved successfully",
            });
        } catch (error) {
            next(error);
        }
    },
}