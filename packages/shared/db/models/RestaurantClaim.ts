import { Model, DataTypes, type Sequelize, type Optional } from "sequelize";

export interface RestaurantClaimAttributes {
  id: string;
  restaurant_id: string;
  user_id: string;
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
  declare restaurant_id: string;
  declare user_id: string;
  declare status: "pending" | "approved" | "rejected";

  static initModel(sequelize: Sequelize) {
    RestaurantClaim.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },

        restaurant_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },

        user_id: {
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