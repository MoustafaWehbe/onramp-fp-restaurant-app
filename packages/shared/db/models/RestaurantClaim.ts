import { Model, DataTypes, type Sequelize, type Optional } from "sequelize";

export interface RestaurantClaimAttributes {
  id: string;
  restaurantId: string|null;
  userId: string;
  restaurantName: string;
  email: string;
  phone: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RestaurantClaimCreationAttributes
  extends Optional<RestaurantClaimAttributes, "id"> {}

export class RestaurantClaim
  extends Model<
    RestaurantClaimAttributes,
    RestaurantClaimCreationAttributes
  >
  implements RestaurantClaimAttributes
{
  declare id: string;
  declare restaurantId: string|null;
  declare userId: string;
  declare restaurantName: string;
  declare email: string;
  declare phone: string;
  declare status: "pending" | "approved" | "rejected";
    declare readonly createdAt: Date;
  declare readonly updatedAt: Date;


  static initModel(sequelize: Sequelize) {
    RestaurantClaim.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },

        restaurantId: {
          type: DataTypes.UUID,
          allowNull: true,
        },

        userId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        restaurantName: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        email: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isEmail: true,
          },
        },

        phone: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM(
            "pending",
            "approved",
            "rejected"
          ),
          allowNull: false,
          defaultValue: "pending",
        },
      },
      {
        sequelize,
        tableName: "restaurant_claims",
        modelName: "RestaurantClaim",
        underscored: true,
        timestamps: true,
      }
    );
  }
}