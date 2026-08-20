import { Job } from "bullmq";

export type IndexJobData = {
    restaurantId?: string;
    menuId?: string;
    menuItemId?: string;
};

export type JobName =
    | "INDEX_RESTAURANT"
    | "INDEX_MENU"
    | "INDEX_MENU_ITEM"
    | "DELETE_RESTAURANT"
    | "DELETE_MENU"
    | "DELETE_MENU_ITEM";

export type JobHandler = (job: Job<IndexJobData>) => Promise<void>;