import { Model, DataTypes, type Sequelize, type Optional } from "sequelize";

export interface MenuAttributes {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  is_active: boolean;
}

export interface MenuCreationAttributes
  extends Optional<MenuAttributes, "id" | "is_active"> {}

export class Menu
  extends Model<MenuAttributes, MenuCreationAttributes>
  implements MenuAttributes
{
  declare id: string;
  declare restaurantId: string;
  declare name: string;
  declare description: string;
  declare is_active: boolean;

  static initModel(sequelize: Sequelize) {
    Menu.init(
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

        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },

        is_active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
      },
      {
        sequelize,
        tableName: "menus",
        modelName: "Menu",
        underscored: true,
        timestamps: true,
        paranoid: true,
      }
    );
  }
}