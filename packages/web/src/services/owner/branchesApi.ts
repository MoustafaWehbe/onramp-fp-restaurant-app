import { apiClient } from "@/lib/api-client";
import type { Branch } from "@/types/restaurant";

export const ownerBranchesApi = {
  getRestaurantBranches: async (restaurantSlug: string): Promise<Branch[]> => {
    const { data } = await apiClient.get(
      `/owner/restaurants/${restaurantSlug}/branches`,
    );
    return data.data ?? data ?? [];
  },
};