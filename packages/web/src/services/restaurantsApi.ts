import { apiClient } from "@/lib/api-client";
import type { RestaurantDetails,RestaurantDetailsResponse, RestaurantListResponse, RestaurantSearchParams } from "@/types/restaurant";

export const restaurantsApi = {
    getBySlug: async (slug: string): Promise<RestaurantDetails> => {
        const { data } = await apiClient.get<RestaurantDetailsResponse>(
            `/restaurants/${slug}`,
        )
        return data.data;
    },

    getAll: async (params?: { page?: number; limit?: number }): Promise<RestaurantListResponse> => {
        const { data } = await apiClient.get<RestaurantListResponse>("/restaurants", {
            params,
        });

        return data;
    },
    
    search: async (params: RestaurantSearchParams): Promise<RestaurantListResponse> => {
        const { data } = await apiClient.get<RestaurantListResponse>("/restaurants/search", {
            params,
        });

        return data;
    }
};