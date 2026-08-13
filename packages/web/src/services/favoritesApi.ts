import { apiClient } from "@/lib/api-client"
import { Restaurant } from "@/types/restaurant";

export const favoritesApi = {
    getFavorites: async () => {
        const { data } = await apiClient.get<{ data: Restaurant[] }>(
            `/favorites`,
        )
        return data.data;
    },

    create: async(restaurantSlug: string) => {
        await apiClient.post(
            `/restaurants/${restaurantSlug}/favorites`,
        )
    },

    delete: async(restaurantSlug: string) => {
        await apiClient.delete(
            `/restaurants/${restaurantSlug}/favorites`,
        )
    }
}