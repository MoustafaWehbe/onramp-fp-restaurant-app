import { Sequelize } from "sequelize";
import { initModels } from "@fp_restaurant/shared";

export const sequelize = new Sequelize(
    process.env.DATABASE_URL!,
    {
        dialect: "postgres",
        logging: false,
    }
);

export async function initDatabase() {
    initModels(sequelize);

    await sequelize.authenticate();

    console.log("[embedding-worker] Database connected");
}