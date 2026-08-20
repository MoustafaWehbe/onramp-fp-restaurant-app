import type { Job } from "bullmq";

import { indexRestaurant } from "../indexers/restaurant.indexer.js";
import { indexMenu } from "../indexers/menu.indexer.js";
import { indexMenuItem } from "../indexers/menu-item.indexer.js";
import { embeddingRepository } from "../repositories/embedding.repository.js";
import type { JobHandler, JobName } from "../types/jobs.js";

export const jobHandlers: Record<JobName, JobHandler> = {
    INDEX_RESTAURANT: async (job) => {
        const { restaurantId } = job.data;

        if (!restaurantId) {
            throw new Error("INDEX_RESTAURANT job requires restaurantId");
        }

        await indexRestaurant(restaurantId);
    },

    INDEX_MENU: async (job) => {
        const { menuId } = job.data;

        if (!menuId) {
            throw new Error("INDEX_MENU job requires menuId");
        }

        await indexMenu(menuId);
    },

    INDEX_MENU_ITEM: async (job) => {
        const { menuItemId } = job.data;

        if (!menuItemId) {
            throw new Error("INDEX_MENU_ITEM job requires menuItemId");
        }

        await indexMenuItem(menuItemId);
    },

    DELETE_RESTAURANT: async (job) => {
        const { restaurantId } = job.data;

        if (!restaurantId) {
            throw new Error("DELETE_RESTAURANT job requires restaurantId");
        }

        await embeddingRepository.delete(
            "restaurant",
            restaurantId
        );
    },

    DELETE_MENU: async (job) => {
        const { menuId } = job.data;

        if (!menuId) {
            throw new Error("DELETE_MENU job requires menuId");
        }

        await embeddingRepository.delete(
            "menu",
            menuId
        );
    },

    DELETE_MENU_ITEM: async (job) => {
        const { menuItemId } = job.data;

        if (!menuItemId) {
            throw new Error("DELETE_MENU_ITEM job requires menuItemId");
        }

        await embeddingRepository.delete(
            "menu_item",
            menuItemId
        );
    },
};