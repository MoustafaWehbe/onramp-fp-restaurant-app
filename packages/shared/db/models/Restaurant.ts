import { Model, DataTypes, type Sequelize, type Optional, type NonAttribute } from "sequelize";
import { Menu } from "./Menu";
export interface RestaurantAttributes {
  id: string;
  name: string;
  slug:string;
  description: string;
  cuisine_type: string;
  ambiance_tags: string[];
  price_range: string;
  email: string;
  phone: string;
  review_count: number,
  average_rating: number,

}

export interface RestaurantCreationAttributes
  extends Optional<RestaurantAttributes, "id"> {}

export class Restaurant
  extends Model<RestaurantAttributes, RestaurantCreationAttributes>
  implements RestaurantAttributes
{
  declare id: string;
  declare name: string;
  declare slug: string;
  declare description: string;
  declare cuisine_type: string;
  declare ambiance_tags: string[];
  declare price_range: string;
  declare email: string;
  declare phone: string;
  declare review_count: number;
  declare average_rating: number;
  declare menus?: NonAttribute<Menu[]>;
  static initModel(sequelize: Sequelize) {
    Restaurant.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        slug: {
          type: DataTypes.STRING,
          allowNull:false,
          unique:true,
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
          type: DataTypes.STRING,
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
          type: DataTypes.DECIMAL(3,2),
          allowNull: false,
          defaultValue: 0.00,
        },
      },
      {
        sequelize,
        tableName: "restaurants",
        modelName: "Restaurant",
        underscored: true,
        timestamps: true,
      }
    );
  }
}