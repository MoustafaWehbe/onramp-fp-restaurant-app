import { Menu } from "@fp_restaurant/shared";

export async function getMenuById(
    menuId: string
): Promise<Menu | null> {
    return Menu.findByPk(menuId);
}