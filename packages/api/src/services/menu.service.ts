import { createError } from "src/middleware/error-handler";
import { Menu } from "../models/Menu";
import { MenuItem } from "../models/MenuItem";

export const menuService = {
    getMenuById: async (id: string) => {
        const menu = await Menu.findByPk(id, {
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
                }
            ]
        });

        if(!menu) {
            throw createError("Menu not found");
        }

        return menu;
    },
}