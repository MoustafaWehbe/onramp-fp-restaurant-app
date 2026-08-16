import { apiClient } from "@/lib/api-client";

export const ownerMenusApi = {
  getRestaurantMenus: async (restaurantSlug: string) => {
    const { data } = await apiClient.get(
      `/owner/restaurants/${restaurantSlug}/menus`,
    );
    return data;
  },

  getBranchMenus: async (restaurantSlug: string, branchSlug: string) => {
    const { data } = await apiClient.get(
      `/owner/restaurants/${restaurantSlug}/branches/${branchSlug}/menus`,
    );
    return data;
  },

  createMenu: async (restaurantSlug: string, payload: any) => {
    const { data } = await apiClient.post(
      `/owner/restaurants/${restaurantSlug}/menus`,
      payload,
    );
    return data;
  },

  updateMenu: async (
    restaurantSlug: string,
    menuId: string,
    payload: { name?: string; description?: string | null; is_active?: boolean },
  ) => {
    const { data } = await apiClient.patch(
      `/owner/restaurants/${restaurantSlug}/menus/${menuId}`,
      payload,
    );
    return data;
  },

  deleteMenu: async (restaurantSlug: string, menuId: string) => {
    const { data } = await apiClient.delete(
      `/owner/restaurants/${restaurantSlug}/menus/${menuId}`,
    );
    return data;
  },

  addMenuItem: async (
    restaurantSlug: string,
    menuId: string,
    payload: FormData,
  ) => {
    const { data } = await apiClient.post(
      `/owner/restaurants/${restaurantSlug}/menus/${menuId}`,
      payload,
    );
    return data;
  },

  updateMenuItem: async (
    restaurantSlug: string,
    menuId: string,
    menuItemId: string,
    payload: FormData,
  ) => {
    const { data } = await apiClient.patch(
      `/owner/restaurants/${restaurantSlug}/menus/${menuId}/menu-items/${menuItemId}`,
      payload,
    );
    return data;
  },

  overrideBranchMenuItem: async (
    restaurantSlug: string,
    branchSlug: string,
    menuItemId: string,
    payload: { customPrice?: number | null; isAvailable?: boolean },
  ) => {
    const { data } = await apiClient.patch(
      `/owner/restaurants/${restaurantSlug}/branches/${branchSlug}/menu-items/${menuItemId}`,
      payload,
    );
    return data;
  },
};