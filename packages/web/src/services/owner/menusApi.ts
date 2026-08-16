import { apiClient } from "@/lib/api-client";
import { unwrapResponse } from "@/lib/api-response";
import type {
  BranchMenu,
  Menu,
} from "@/types/menu";

export const ownerMenusApi = {
  getRestaurantMenus: async (
    restaurantSlug: string,
  ): Promise<Menu[]> => {
    const response = await apiClient.get(
      `/owner/restaurants/${restaurantSlug}/menus`,
    );

    return unwrapResponse<Menu[]>(response.data);
  },

  getBranchMenus: async (
    restaurantSlug: string,
    branchSlug: string,
  ): Promise<BranchMenu[]> => {
    const response = await apiClient.get(
      `/owner/restaurants/${restaurantSlug}/branches/${branchSlug}/menus`,
    );

    return unwrapResponse<BranchMenu[]>(response.data);
  },

  createMenu: async (
    restaurantSlug: string,
    payload: FormData,
  ): Promise<Menu> => {
    const response = await apiClient.post(
      `/owner/restaurants/${restaurantSlug}/menus`,
      payload,
    );

    return unwrapResponse<Menu>(response.data);
  },

  updateMenu: async (
    restaurantSlug: string,
    menuId: string,
    payload: {
      name?: string;
      description?: string | null;
      is_active?: boolean;
    },
  ): Promise<Menu> => {
    const response = await apiClient.patch(
      `/owner/restaurants/${restaurantSlug}/menus/${menuId}`,
      payload,
    );

    return unwrapResponse<Menu>(response.data);
  },

  deleteMenu: async (
    restaurantSlug: string,
    menuId: string,
  ): Promise<void> => {
    await apiClient.delete(
      `/owner/restaurants/${restaurantSlug}/menus/${menuId}`,
    );
  },

  addMenuItem: async (
    restaurantSlug: string,
    menuId: string,
    payload: FormData,
  ): Promise<Menu> => {
    const response = await apiClient.post(
      `/owner/restaurants/${restaurantSlug}/menus/${menuId}`,
      payload,
    );

    return unwrapResponse<Menu>(response.data);
  },

  updateMenuItem: async (
    restaurantSlug: string,
    menuId: string,
    menuItemId: string,
    payload: FormData,
  ): Promise<Menu> => {
    const response = await apiClient.patch(
      `/owner/restaurants/${restaurantSlug}/menus/${menuId}/menu-items/${menuItemId}`,
      payload,
    );

    return unwrapResponse<Menu>(response.data);
  },

  overrideBranchMenuItem: async (
    restaurantSlug: string,
    branchSlug: string,
    menuItemId: string,
    payload: {
      customPrice?: number | null;
      isAvailable?: boolean;
    },
  ): Promise<BranchMenu> => {
    const response = await apiClient.patch(
      `/owner/restaurants/${restaurantSlug}/branches/${branchSlug}/menu-items/${menuItemId}`,
      payload,
    );

    return unwrapResponse<BranchMenu>(response.data);
  },
};