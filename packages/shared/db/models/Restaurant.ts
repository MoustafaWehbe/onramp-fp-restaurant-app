import { Model, DataTypes, type Sequelize, type Optional, type NonAttribute } from "sequelize";
import { Menu } from "./Menu";
export interface RestaurantAttributes {
  id: string;
  image_url: string;
  name: string;
  slug: string;
  description: string;
  cuisine_type: string;
  ambiance_tags: string[];
  price_range: PriceRange;
  email: string;
  phone: string;
  review_count: number,
  average_rating: number,
  deletedAt?: Date | null;
}
export const PRICE_RANGES = [
  "Budget",
  "Average",
  "Expensive",
  "Luxury",
] as const;

export type PriceRange = (typeof PRICE_RANGES)[number];
export interface RestaurantCreationAttributes
  extends Optional<Omit<RestaurantAttributes,"deletedAt">, "id"> { }

export class Restaurant
  extends Model<RestaurantAttributes, RestaurantCreationAttributes>
  implements RestaurantAttributes {
  declare id: string;
  declare image_url: string;
  declare name: string;
  declare slug: string;
  declare description: string;
  declare cuisine_type: string;
  declare ambiance_tags: string[];
  declare price_range: PriceRange;
  declare email: string;
  declare phone: string;
  declare review_count: number;
  declare average_rating: number;
  declare menus?: NonAttribute<Menu[]>;
  declare deletedAt: Date | null;
  static initModel(sequelize: Sequelize) {
    Restaurant.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        image_url: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        slug: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        cuisine_type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        ambiance_tags: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        price_range: {
          type: DataTypes.ENUM(...PRICE_RANGES),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        review_count: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        average_rating: {
          type: DataTypes.DECIMAL(3, 2),
          allowNull: false,
          defaultValue: 0.00,
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: null,
        },
      },
      {
        sequelize,
        tableName: "restaurants",
        modelName: "Restaurant",
        underscored: true,
        timestamps: true,
        paranoid: true,
        deletedAt: "deleted_at",
      }
    );
  }
}