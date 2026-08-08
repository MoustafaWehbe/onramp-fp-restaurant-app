import { apiClient } from "@/lib/api-client";
import type { RestaurantDetails,RestaurantDetailsResponse } from "@/types/restaurant";

export const restaurantsApi = {
    getBySlug: async (slug: string): Promise<RestaurantDetails> => {
        const { data } = await apiClient.get<RestaurantDetailsResponse>(
            `/restaurants/${slug}`,
        )
        return data.data;
    },
};