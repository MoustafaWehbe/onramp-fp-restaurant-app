import { Model, DataTypes, type Sequelize, type Optional } from "sequelize";

export interface FavoriteAttributes {
  id: string;
  user_id: string;
  restaurant_id: string;
}

export interface FavoriteCreationAttributes
  extends Optional<FavoriteAttributes, "id"> {}

export class Favorite
  extends Model<FavoriteAttributes, FavoriteCreationAttributes>
  implements FavoriteAttributes
{
  declare id: string;
  declare user_id: string;
  declare restaurant_id: string;

  static initModel(sequelize: Sequelize) {
    Favorite.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },

        user_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },

        restaurant_id: {
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

  static associate(models: any) {
    Favorite.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });

    Favorite.belongsTo(models.Restaurant, {
      foreignKey: "restaurant_id",
      as: "restaurant",
    });
  }
}