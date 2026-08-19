import { Restaurant } from "@fp_restaurant/shared";

export async function getRestaurantById(
    restaurantId: string
): Promise<Restaurant | null> {
    return Restaurant.findByPk(restaurantId);
}