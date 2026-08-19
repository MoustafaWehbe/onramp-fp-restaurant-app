import { apiClient } from "@/lib/api-client";

export interface RestaurantClaim {
  id: string;

  restaurant: {
    id: string;
    name: string;
    slug: string;
  };

  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };

  message?: string | null;

  status: "pending" | "approved" | "rejected" | "completed";

  createdAt: string;
}

export const restaurantClaimsApi = {
  getAll: async (): Promise<RestaurantClaim[]> => {
    const response = await apiClient.get("/admin/restaurant-claims");

    return response.data.data.data ?? response.data.data;
  },

  approveClaim: async (claimId: string): Promise<RestaurantClaim> => {
    const response = await apiClient.patch(
      `/admin/restaurant-claims/${claimId}/approve`,
    );

    return response.data.data;
  },

  rejectClaim: async (claimId: string): Promise<RestaurantClaim> => {
    const response = await apiClient.patch(
      `/admin/restaurant-claims/${claimId}/reject`,
    );

    return response.data.data;
  },
};
