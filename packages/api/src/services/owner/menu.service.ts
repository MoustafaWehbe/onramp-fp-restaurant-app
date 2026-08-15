import { Menu } from "../../models/Menu";
import { MenuItem } from "../../models/MenuItem";
import { BranchMenuItem } from "../../models/BranchMenuItem";
import { Branch } from "../../models/Branch";
import { Restaurant } from "../../models/Restaurant";
import { createError } from "src/middleware/error-handler";
import {
  storageService,
  type UploadableFile,
} from "../storage/storage.service";

interface CreateMenuItemInput {
  name: string;
  description?: string | null;
  base_price: number;
  display_order?: number;
  is_active?: boolean;
  image?: UploadableFile | null;
}

interface CreateMenuInput {
  restaurantSlug: string;
  name: string;
  description?: string | null;
  is_active?: boolean;
  items?: CreateMenuItemInput[];
}

interface UpdateMenuInput {
  name?: string;
  description?: string | null;
  is_active?: boolean;
}

interface BranchMenuItemOverrideInput {
  restaurantSlug: string;
  branchSlug: string;
  menuItemId: string;
  customPrice?: number | null;
  isAvailable?: boolean;
}

interface UpdateMenuItemInput {
  name?: string;
  description?: string | null;
  base_price?: number;
  image?: UploadableFile | null;
  display_order?: number;
  is_active?: boolean;
}

export const menuService = {
  create: async (input: CreateMenuInput) => {
    const sequelize = Menu.sequelize;

    if (!sequelize) {
      throw createError("Sequelize instance is not initialized");
    }

    const uploadedImages: string[] = [];

    try {
      /**
       * Upload images before opening the transaction
       */
      const preparedItems = await Promise.all(
        (input.items ?? []).map(async (item, index) => {
          const menuItemId = crypto.randomUUID();

          let imageUrl: string | null = null;

          if (item.image) {
            imageUrl = await storageService.uploadFile(
              item.image,
              `menu-items/${menuItemId}`,
            );

            uploadedImages.push(imageUrl);
          }

          return {
            menuItemId,
            name: item.name,
            description: item.description ?? null,
            base_price: item.base_price,
            imageUrl,
            display_order: item.display_order ?? index,
            is_active: item.is_active ?? true,
          };
        }),
      );

      /**
       * Database transaction only contains database operations
       */
      return await sequelize.transaction(async (transaction) => {
        const restaurant = await Restaurant.findOne({
          where: {
            slug: input.restaurantSlug,
          },
          transaction,
        });

        if (!restaurant) {
          throw createError("Restaurant not found", 404);
        }

        const menu = await Menu.create(
          {
            restaurantId: restaurant.id,
            name: input.name,
            description: input.description ?? null,
            is_active: input.is_active ?? true,
          },
          {
            transaction,
          },
        );

        await MenuItem.bulkCreate(
          preparedItems.map((item) => ({
            id: item.menuItemId,
            menuId: menu.id,
            name: item.name,
            description: item.description,
            base_price: item.base_price,
            image_url: item.imageUrl,
            display_order: item.display_order,
            is_active: item.is_active,
          })),
          {
            transaction,
          },
        );

        return menu;
      });
    } catch (error) {
      /**
       * Cleanup uploaded files if DB transaction fails
       */
      await Promise.all(
        uploadedImages.map((image) =>
          storageService.deleteFile(image).catch(() => {}),
        ),
      );

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
        throw createError("Restaurant not found", 404);
      }

      const branch = await Branch.findOne({
        where: {
          slug: input.branchSlug,
          restaurantId: restaurant.id,
        },
        transaction,
      });

      if (!branch) {
        throw createError("Branch not found for this restaurant", 404);
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
        throw createError("Menu item not found", 404);
      }

      const menu = (menuItem as MenuItem & { menu: Menu }).menu;

      if (menu.restaurantId !== restaurant.id) {
        throw createError("Menu item does not belong to this restaurant", 400);
      }

      if (menu.restaurantId !== branch.restaurantId) {
        throw createError(
          "Menu item does not belong to this branch's restaurant",
          400,
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
      throw createError("Restaurant not found", 404);
    }

    const menus = await Menu.findAll({
      where: {
        restaurantId: restaurant.id,
      },
      include: [
        {
          model: MenuItem,
          as: "menuItems",
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

    return menus;
  },

  getBranchMenus: async (restaurantSlug: string, branchSlug: string) => {
    const restaurant = await Restaurant.findOne({
      where: {
        slug: restaurantSlug,
      },
    });

    if (!restaurant) {
      throw createError("Restaurant not found", 404);
    }

    const branch = await Branch.findOne({
      where: {
        slug: branchSlug,
        restaurantId: restaurant.id,
      },
    });

    if (!branch) {
      throw createError("Branch not found for this restaurant", 404);
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
      throw createError("No menus were found for this branch", 404);
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
        throw createError("Restaurant not found", 404);
      }

      const menu = await Menu.findOne({
        where: {
          id: menuId,
          restaurantId: restaurant.id,
        },
        transaction,
      });

      if (!menu) {
        throw createError("Menu not found for this restaurant", 404);
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

  updateMenu: async (
    restaurantSlug: string,
    menuId: string,
    input: UpdateMenuInput,
  ) => {
    try {
      const restaurant = await Restaurant.findOne({
        where: {
          slug: restaurantSlug,
        },
      });

      if (!restaurant) {
        throw createError("Restaurant not found", 404);
      }

      const menu = await Menu.findOne({
        where: {
          id: menuId,
          restaurantId: restaurant.id,
        },
      });

      if (!menu) {
        throw createError("Menu not found for this restaurant", 404);
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

      await menu.save();
      return menu;
    } catch (error) {
      throw error;
    }
  },

  addMenuItem: async (
    restaurantSlug: string,
    menuId: string,
    item: CreateMenuItemInput,
  ) => {
    const sequelize = Menu.sequelize;

    if (!sequelize) {
      throw createError("Sequelize instance is not initialized");
    }

    const transaction = await sequelize.transaction();
    let uploadedPath: string | null = null;

    try {
      const restaurant = await Restaurant.findOne({
        where: { slug: restaurantSlug },
        transaction,
      });

      if (!restaurant) {
        throw createError("Restaurant not found", 404);
      }

      const menu = await Menu.findOne({
        where: { id: menuId, restaurantId: restaurant.id },
        transaction,
      });

      if (!menu) {
        throw createError("Menu not found for this restaurant", 404);
      }

      let displayOrder = item.display_order;

      if (displayOrder === undefined) {
        const lastItem = await MenuItem.findOne({
          where: { menuId: menu.id },
          order: [["display_order", "DESC"]],
          lock: transaction.LOCK.UPDATE,
          transaction,
        });

        displayOrder = lastItem ? lastItem.display_order + 1 : 0;
      }

      const menuItemId = crypto.randomUUID();
      let image_url: string | null = null;

      if (item.image) {
        image_url = await storageService.uploadFile(
          item.image,
          `menu-items/${menuItemId}`,
        );
        uploadedPath = image_url;
      }

      const menuItem = await MenuItem.create(
        {
          id: menuItemId,
          menuId: menu.id,
          name: item.name,
          description: item.description ?? null,
          base_price: item.base_price,
          image_url,
          display_order: displayOrder,
          is_active: item.is_active,
        },
        { transaction },
      );

      await transaction.commit();
      return menuItem;
    } catch (error) {
      await transaction.rollback();

      if (uploadedPath) {
        storageService.deleteFile(uploadedPath).catch(() => {});
      }

      throw error;
    }
  },

  updateMenuItem: async (
    restaurantSlug: string,
    menuId: string,
    menuItemId: string,
    input: UpdateMenuItemInput,
  ) => {
    const restaurant = await Restaurant.findOne({
      where: {
        slug: restaurantSlug,
      },
    });

    if (!restaurant) {
      throw createError("Restaurant not found", 404);
    }

    const menu = await Menu.findOne({
      where: {
        id: menuId,
        restaurantId: restaurant.id,
      },
    });

    if (!menu) {
      throw createError("Menu not found for this restaurant", 404);
    }

    const menuItem = await MenuItem.findOne({
      where: {
        id: menuItemId,
        menuId: menu.id,
      },
    });

    if (!menuItem) {
      throw createError("Menu item not found", 404);
    }

    const oldImageUrl = menuItem.image_url;
    let newImageUrl: string | null = null;

    if (input.name !== undefined) {
      menuItem.name = input.name;
    }

    if (input.description !== undefined) {
      menuItem.description = input.description;
    }

    if (input.base_price !== undefined) {
      menuItem.base_price = input.base_price;
    }

    if (input.display_order !== undefined) {
      menuItem.display_order = input.display_order;
    }

    if (input.is_active !== undefined) {
      menuItem.is_active = input.is_active;
    }

    try {
      if (input.image) {
        newImageUrl = await storageService.uploadFile(
          input.image,
          `menu-items/${menuItem.id}`,
        );

        menuItem.image_url = newImageUrl;
      }

      await menuItem.save();
    } catch (error) {
      // Database failed after uploading the new image
      // remove the new orphaned upload
      if (newImageUrl) {
        await storageService.deleteFile(newImageUrl).catch(() => {});
      }

      throw error;
    }

    // Database update succeeded.
    // Old image cleanup is best-effort only.
    if (newImageUrl && oldImageUrl) {
      await storageService.deleteFile(oldImageUrl).catch(() => {});
    }

    return menuItem;
  },
};
