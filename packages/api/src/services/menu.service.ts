import { createError } from "src/middleware/error-handler";
import { Menu } from "../models/Menu";
import { MenuItem } from "../models/MenuItem";
import { Branch, BranchMenuItem, Restaurant } from "@starter-kit/shared";

export const menuService = {
    getMenuByIdForBranch: async (
        menuId: string,
        branchSlug: string
    ) => {
        const branch = await Branch.findOne({
            where: {
                slug: branchSlug,
            },
            include: [
            {
                model: Restaurant,
                as: "restaurant",
                required: true,
            },
            ],
        });

        if (!branch) {
            throw createError("Branch not found");
        }

        const menu = await Menu.findByPk(menuId, {
            attributes: [
                "id",
                "name",
                "description",
            ],
            include: [
                {
                    model: MenuItem,
                    as: "menuItems",
                    attributes: [
                        "id",
                        "menuId",
                        "name",
                        "description",
                        "base_price",
                        "image_url",
                        "display_order",
                        "is_active",
                    ],
                    include: [
                        {
                            model: BranchMenuItem,
                            as: "branchMenuItems",
                            required: false,
                            where: {
                                branchId: branch.id,
                            },
                            attributes: [
                                "id",
                                "customPrice",
                                "isAvailable",
                            ],
                        },
                    ],
                },
            ],
        });

        if (!menu) {
            throw createError("Menu not found");
        }

        return menu;
    },
}