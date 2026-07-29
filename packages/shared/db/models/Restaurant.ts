import { Model, DataTypes, type Sequelize, type Optional } from "sequelize";

export interface RestaurantAttributes {
  id: string;
  name: string;
  description: string;
  cuisine_type: string;
  ambiance_tags: string[];
  price_range: string;
  email: string;
  phone: string;
}

export interface RestaurantCreationAttributes
  extends Optional<RestaurantAttributes, "id"> {}

export class Restaurant
  extends Model<RestaurantAttributes, RestaurantCreationAttributes>
  implements RestaurantAttributes
{
  declare id: string;
  declare name: string;
  declare description: string;
  declare cuisine_type: string;
  declare ambiance_tags: string[];
  declare price_range: string;
  declare email: string;
  declare phone: string;

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

  static associate(models: any) {
    // Define associations here when needed
  }
}