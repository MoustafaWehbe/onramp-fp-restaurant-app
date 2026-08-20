import { MenuItem } from "@fp_restaurant/shared";

export async function getMenuItemById(
    menuItemId: string
): Promise<MenuItem | null> {
    return MenuItem.findByPk(menuItemId);
}