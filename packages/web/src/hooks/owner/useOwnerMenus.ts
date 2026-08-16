import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ownerMenusApi } from "@/services/owner/menusApi";
import type { Menu, MenuUpdatePayload } from "@/types/menu";

interface UseOwnerMenusOptions {
  selectedBranchSlug: string | null;
  onMenuCreated: (menu: Menu) => void;
  onMenuDeleted: () => void;
  onMenuItemAdded: () => void;
  onMenuItemUpdated: () => void;
}

export function useOwnerMenus(
  restaurantSlug: string | null,
  {
    selectedBranchSlug,
    onMenuCreated,
    onMenuDeleted,
    onMenuItemAdded,
    onMenuItemUpdated,
  }: UseOwnerMenusOptions,
) {
  const queryClient = useQueryClient();

  const invalidateMenuQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ["owner-menus", restaurantSlug],
    });
    queryClient.invalidateQueries({
      queryKey: ["owner-branch-menus", restaurantSlug, selectedBranchSlug],
    });
  };

  const menusQuery = useQuery<Menu[]>({
    queryKey: ["owner-menus", restaurantSlug],
    queryFn: () => ownerMenusApi.getRestaurantMenus(restaurantSlug!),
    enabled: Boolean(restaurantSlug),
  });

  const createMenuMutation = useMutation({
    mutationFn: (payload: FormData) =>
      ownerMenusApi.createMenu(restaurantSlug!, payload),
    onSuccess: (newMenu: Menu) => {
      invalidateMenuQueries();
      onMenuCreated(newMenu);
    },
  });

  const updateMenuMutation = useMutation({
    mutationFn: ({
      menuId,
      payload,
    }: {
      menuId: string;
      payload: MenuUpdatePayload;
    }) => ownerMenusApi.updateMenu(restaurantSlug!, menuId, payload),
    onSuccess: invalidateMenuQueries,
  });

  const deleteMenuMutation = useMutation({
    mutationFn: (menuId: string) =>
      ownerMenusApi.deleteMenu(restaurantSlug!, menuId),
    onSuccess: () => {
      invalidateMenuQueries();
      onMenuDeleted();
    },
  });

  const addMenuItemMutation = useMutation({
    mutationFn: ({
      menuId,
      formData,
    }: {
      menuId: string;
      formData: FormData;
    }) => ownerMenusApi.addMenuItem(restaurantSlug!, menuId, formData),
    onSuccess: () => {
      invalidateMenuQueries();
      onMenuItemAdded();
    },
  });

  const updateMenuItemMutation = useMutation({
    mutationFn: ({
      menuId,
      menuItemId,
      formData,
    }: {
      menuId: string;
      menuItemId: string;
      formData: FormData;
    }) =>
      ownerMenusApi.updateMenuItem(
        restaurantSlug!,
        menuId,
        menuItemId,
        formData,
      ),
    onSuccess: () => {
      invalidateMenuQueries();
      onMenuItemUpdated();
    },
  });

  return {
    ...menusQuery,
    createMenuMutation,
    updateMenuMutation,
    deleteMenuMutation,
    addMenuItemMutation,
    updateMenuItemMutation,
  };
}
