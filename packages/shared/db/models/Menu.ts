import { Model, DataTypes, type Sequelize, type Optional } from "sequelize";

export interface MenuAttributes {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string | null;
  is_active: boolean;
}

export interface MenuCreationAttributes
  extends Optional<MenuAttributes, "id" | "description" | "is_active"> {}

export class Menu
  extends Model<MenuAttributes, MenuCreationAttributes>
  implements MenuAttributes
{
  declare id: string;
  declare restaurant_id: string;
  declare name: string;
  declare description: string | null;
  declare is_active: boolean;

  static initModel(sequelize: Sequelize) {
    Menu.init(
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

        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        description: {
          type: DataTypes.TEXT,
          allowNull: true,
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