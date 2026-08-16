import { apiClient } from "@/lib/api-client";
import { unwrapResponse } from "@/lib/api-response";
import type { Branch } from "@/types/restaurant";

export const ownerBranchesApi = {
  getRestaurantBranches: async (
    restaurantSlug: string,
  ): Promise<Branch[]> => {
    const { data } = await apiClient.get(
      `/owner/restaurants/${restaurantSlug}/branches`,
    );

    const branches = unwrapResponse<Branch[]>(data);

    return Array.isArray(branches) ? branches : [];
  },
};