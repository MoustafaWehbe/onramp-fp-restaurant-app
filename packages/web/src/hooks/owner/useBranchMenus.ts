import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ownerBranchesApi } from "@/services/owner/branchesApi";
import { ownerMenusApi } from "@/services/owner/menusApi";
import type { Branch } from "@/types/restaurant";
import type { BranchMenu, BranchMenuItemOverridePayload } from "@/types/menu";

export function useBranchMenus(
  restaurantSlug: string | null,
  selectedBranchSlug: string | null,
) {
  const queryClient = useQueryClient();

  const branchesQuery = useQuery<Branch[]>({
    queryKey: ["owner-branches", restaurantSlug],
    queryFn: () => ownerBranchesApi.getRestaurantBranches(restaurantSlug!),
    enabled: Boolean(restaurantSlug),
  });

  const branchMenusQuery = useQuery<BranchMenu[]>({
    queryKey: ["owner-branch-menus", restaurantSlug, selectedBranchSlug],
    queryFn: () =>
      ownerMenusApi.getBranchMenus(restaurantSlug!, selectedBranchSlug!),
    enabled: Boolean(restaurantSlug && selectedBranchSlug),
  });

  const overrideMutation = useMutation({
    mutationFn: ({
      menuItemId,
      payload,
    }: {
      menuItemId: string;
      payload: BranchMenuItemOverridePayload;
    }) =>
      ownerMenusApi.overrideBranchMenuItem(
        restaurantSlug!,
        selectedBranchSlug!,
        menuItemId,
        payload,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["owner-branch-menus", restaurantSlug, selectedBranchSlug],
      });
    },
  });

  return { branchesQuery, branchMenusQuery, overrideMutation };
}
