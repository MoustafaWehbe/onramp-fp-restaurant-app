import { Model, DataTypes, type Sequelize, type Optional } from "sequelize";

export interface RestaurantAttributes {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  phone: string;
  image_url: string;
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
  declare address: string;
  declare city: string;
  declare latitude: number;
  declare longitude: number;
  declare phone: string;
  declare image_url: string;

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
        address: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        city: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        latitude: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        longitude: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        image_url: {
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