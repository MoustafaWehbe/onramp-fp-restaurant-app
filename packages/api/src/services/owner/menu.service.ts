import { Menu } from "../../models/Menu";
import { MenuItem } from "../../models/MenuItem";
import { BranchMenuItem } from "../../models/BranchMenuItem";
import { Branch } from "../../models/Branch";
import { Restaurant } from "../../models/Restaurant";
import { createError } from "src/middleware/error-handler";

interface CreateMenuItemInput {
  name: string;
  description?: string | null;
  base_price: number;
  image_url?: string | null;
  display_order?: number;
  is_active?: boolean;
}

interface CreateMenuInput {
  restaurantSlug: string;
  name: string;
  description?: string | null;
  is_active?: boolean;
  items?: CreateMenuItemInput[];
}

interface UpdateMenuInput {
  restaurantSlug: string;
  menuId: string;
  name?: string;
  description?: string | null;
  is_active?: boolean;
  items?: CreateMenuItemInput[];
}

interface BranchMenuItemOverrideInput {
  restaurantSlug: string;
  branchSlug: string;
  menuItemId: string;
  customPrice?: number | null;
  isAvailable?: boolean;
}

export const menuService = {
  create: async (input: CreateMenuInput) => {
    const sequelize = Menu.sequelize;

    if (!sequelize) {
      throw createError("Sequelize instance is not initialized");
    }

    const transaction = await sequelize.transaction();

    try {
      const restaurant = await Restaurant.findOne({
        where: {
          slug: input.restaurantSlug,
        },
        transaction,
      });

      if (!restaurant) {
        throw createError("Restaurant not found");
      }

      const menu = await Menu.create(
        {
          restaurantId: restaurant.id,
          name: input.name,
          description: input.description ?? null,
          is_active: input.is_active ?? true,
        },
        { transaction },
      );

      if (input.items?.length) {
        await MenuItem.bulkCreate(
          input.items.map((item, index) => ({
            menuId: menu.id,
            name: item.name,
            description: item.description ?? null,
            base_price: item.base_price,
            image_url: item.image_url ?? null,
            display_order: item.display_order ?? index,
            is_active: item.is_active ?? true,
          })),
          { transaction },
        );
      }

      await transaction.commit();

      return menu;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  overrideBranchMenuItem: async (input: BranchMenuItemOverrideInput) => {
    const sequelize = Menu.sequelize;

    if (!sequelize) {
      throw createError("Sequelize instance is not initialized");
    }

    const transaction = await sequelize.transaction();

    try {
      const restaurant = await Restaurant.findOne({
        where: {
          slug: input.restaurantSlug,
        },
        transaction,
      });

      if (!restaurant) {
        throw createError("Restaurant not found");
      }

      const branch = await Branch.findOne({
        where: {
          slug: input.branchSlug,
          restaurantId: restaurant.id,
        },
        transaction,
      });

      if (!branch) {
        throw createError("Branch not found for this restaurant");
      }

      const menuItem = await MenuItem.findByPk(input.menuItemId, {
        include: [
          {
            model: Menu,
            as: "menu",
            required: true,
          },
        ],
        transaction,
      });

      if (!menuItem) {
        throw createError("Menu item not found");
      }

      const menu = (menuItem as MenuItem & { menu: Menu }).menu;

      if (menu.restaurantId !== restaurant.id) {
        throw createError("Menu item does not belong to this restaurant");
      }

      if (menu.restaurantId !== branch.restaurantId) {
        throw createError(
          "Menu item does not belong to this branch's restaurant",
        );
      }

      let branchMenuItem = await BranchMenuItem.findOne({
        where: {
          branchId: branch.id,
          menuItemId: input.menuItemId,
        },
        transaction,
      });

      if (branchMenuItem) {
        if (input.customPrice !== undefined) {
          branchMenuItem.customPrice =
            input.customPrice === null ? null : input.customPrice.toString();
        }

        if (input.isAvailable !== undefined) {
          branchMenuItem.isAvailable = input.isAvailable;
        }

        await branchMenuItem.save({
          transaction,
        });
      } else {
        branchMenuItem = await BranchMenuItem.create(
          {
            branchId: branch.id,
            menuItemId: input.menuItemId,
            customPrice:
              input.customPrice === undefined || input.customPrice === null
                ? null
                : input.customPrice.toString(),
            isAvailable: input.isAvailable ?? true,
          },
          { transaction },
        );
      }

      await transaction.commit();

      return branchMenuItem;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  getRestaurantMenus: async (restaurantSlug: string) => {
    const restaurant = await Restaurant.findOne({
      where: {
        slug: restaurantSlug,
      },
    });

    if (!restaurant) {
      throw createError("Restaurant not found");
    }

    const menus = await Menu.findAll({
      where: {
        restaurantId: restaurant.id,
        is_active: true,
      },
      include: [
        {
          model: MenuItem,
          as: "menuItems",
          where: {
            is_active: true,
          },
          required: false,
        },
      ],
      order: [
        ["created_at", "ASC"],
        [
          {
            model: MenuItem,
            as: "menuItems",
          },
          "display_order",
          "ASC",
        ],
      ],
    });

    if (menus.length === 0) {
      throw createError("No menus were found for this restaurant");
    }

    return menus;
  },

  getBranchMenus: async (restaurantSlug: string, branchSlug: string) => {
    const restaurant = await Restaurant.findOne({
      where: {
        slug: restaurantSlug,
      },
    });

    if (!restaurant) {
      throw createError("Restaurant not found");
    }

    const branch = await Branch.findOne({
      where: {
        slug: branchSlug,
        restaurantId: restaurant.id,
      },
    });

    if (!branch) {
      throw createError("Branch not found for this restaurant");
    }

    const menus = await Menu.findAll({
      where: {
        restaurantId: restaurant.id,
        is_active: true,
      },
      include: [
        {
          model: MenuItem,
          as: "menuItems",
          where: {
            is_active: true,
          },
          required: false,
          include: [
            {
              model: BranchMenuItem,
              as: "branchMenuItems",
              where: {
                branchId: branch.id,
              },
              required: false,
            },
          ],
        },
      ],
      order: [
        ["created_at", "ASC"],
        [
          {
            model: MenuItem,
            as: "menuItems",
          },
          "display_order",
          "ASC",
        ],
      ],
    });

    if (menus.length === 0) {
      throw createError("No menus were found for this branch");
    }

    return menus.map((menu) => {
      const result = menu.toJSON() as any;

      result.menuItems = (result.menuItems ?? []).map((menuItem: any) => {
        const override = menuItem.branchMenuItems?.[0];

        return {
          ...menuItem,

          price:
            override?.customPrice !== null &&
            override?.customPrice !== undefined
              ? Number(override.customPrice)
              : Number(menuItem.base_price),

          isAvailable:
            override?.isAvailable !== null &&
            override?.isAvailable !== undefined
              ? override.isAvailable
              : menuItem.is_active,

          isOverridden: Boolean(override),

          branchMenuItems: undefined,
        };
      });

      return result;
    });
  },

  delete: async (restaurantSlug: string, menuId: string) => {
    const sequelize = Menu.sequelize;

    if (!sequelize) {
      throw createError("Sequelize instance is not initialized");
    }

    const transaction = await sequelize.transaction();

    try {
      const restaurant = await Restaurant.findOne({
        where: {
          slug: restaurantSlug,
        },
        transaction,
      });

      if (!restaurant) {
        throw createError("Restaurant not found");
      }

      const menu = await Menu.findOne({
        where: {
          id: menuId,
          restaurantId: restaurant.id,
        },
        transaction,
      });

      if (!menu) {
        throw createError("Menu not found for this restaurant");
      }

      const menuItems = await MenuItem.findAll({
        where: {
          menuId: menu.id,
        },
        attributes: ["id"],
        transaction,
      });

      const menuItemIds = menuItems.map((item) => item.id);

      if (menuItemIds.length > 0) {
        await BranchMenuItem.destroy({
          where: {
            menuItemId: menuItemIds,
          },
          transaction,
        });

        await MenuItem.destroy({
          where: {
            menuId: menu.id,
          },
          transaction,
        });
      }

      await menu.destroy({
        transaction,
      });

      await transaction.commit();

      return {
        message: "Menu deleted successfully",
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  update: async (
    restaurantSlug: string,
    menuId: string,
    input: Omit<UpdateMenuInput, "restaurantSlug" | "menuId">,
  ) => {
    const sequelize = Menu.sequelize;

    if (!sequelize) {
      throw createError("Sequelize instance is not initialized");
    }

    const transaction = await sequelize.transaction();

    try {
      const restaurant = await Restaurant.findOne({
        where: {
          slug: restaurantSlug,
        },
        transaction,
      });

      if (!restaurant) {
        throw createError("Restaurant not found");
      }

      const menu = await Menu.findOne({
        where: {
          id: menuId,
          restaurantId: restaurant.id,
        },
        transaction,
      });

      if (!menu) {
        throw createError("Menu not found for this restaurant");
      }

      if (input.name !== undefined) {
        menu.name = input.name;
      }

      if (input.description !== undefined) {
        menu.description = input.description;
      }

      if (input.is_active !== undefined) {
        menu.is_active = input.is_active;
      }

      await menu.save({
        transaction,
      });

      if (input.items?.length) {
        const lastItem = await MenuItem.findOne({
          where: {
            menuId: menu.id,
          },
          order: [["display_order", "DESC"]],
          transaction,
        });

        const nextDisplayOrder =
          lastItem !== null ? lastItem.display_order + 1 : 0;

        await MenuItem.bulkCreate(
          input.items.map((item, index) => ({
            menuId: menu.id,
            name: item.name,
            description: item.description ?? null,
            base_price: item.base_price,
            image_url: item.image_url ?? null,
            display_order: item.display_order ?? nextDisplayOrder + index,
            is_active: item.is_active ?? true,
          })),
          { transaction },
        );
      }

      await transaction.commit();

      return Menu.findByPk(menu.id, {
        include: [
          {
            model: MenuItem,
            as: "menuItems",
          },
        ],
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
