import { Model, DataTypes, type Sequelize, type Optional } from "sequelize";

export interface FavoriteAttributes {
  id: string;
  userId: string;
  restaurantId: string;
}

export interface FavoriteCreationAttributes
  extends Optional<FavoriteAttributes, "id"> {}

export class Favorite
  extends Model<FavoriteAttributes, FavoriteCreationAttributes>
  implements FavoriteAttributes
{
  declare id: string;
  declare userId: string;
  declare restaurantId: string;

  static initModel(sequelize: Sequelize) {
    Favorite.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },

        userId: {
          type: DataTypes.UUID,
          allowNull: false,
        },

        restaurantId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "favorites",
        modelName: "Favorite",
        underscored: true,
        timestamps: true,
      }
    );
  }
}