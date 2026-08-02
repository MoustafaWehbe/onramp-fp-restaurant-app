import { Model, DataTypes, type Sequelize, type Optional } from "sequelize";

export interface RestaurantClaimAttributes {
  id: string;
  restaurantId: string;
  userId: string;
  status: "pending" | "approved" | "rejected";
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
  declare restaurantId: string;
  declare userId: string;
  declare status: "pending" | "approved" | "rejected";

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
          allowNull: false,
        },

        userId: {
          type: DataTypes.UUID,
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