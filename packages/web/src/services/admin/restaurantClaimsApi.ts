import { apiClient } from "@/lib/api-client";

export interface RestaurantClaim {
    id:string;

    restaurantId:string;

    restaurantName:string;

    email:string;

    phone:string | null;

    status:
        | "pending"
        | "approved"
        | "rejected"
        | "completed";

    user:{
        id:string;
        name:string;
        email:string;
    };

    createdAt:string;
}

export const restaurantClaimsApi = {
  getAll: async (): Promise<RestaurantClaim[]> => {
    const response = await apiClient.get("/admin/restaurant-claims");

    return response.data.data.claims;
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
