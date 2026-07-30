import { Model, DataTypes, type Sequelize, type Optional } from "sequelize";

export interface MenuItemAttributes {
  id: string;
  menu_id: string;
  name: string;
  description?: string | null;
  base_price: number;
  image_url?: string | null;
  display_order: number;
  is_active: boolean;
}

export interface MenuItemCreationAttributes
  extends Optional<
    MenuItemAttributes,
    "id" | "description" | "image_url" | "display_order" | "is_active"
  > {}

export class MenuItem
  extends Model<MenuItemAttributes, MenuItemCreationAttributes>
  implements MenuItemAttributes
{
  declare id: string;
  declare menu_id: string;
  declare name: string;
  declare description: string | null;
  declare base_price: number;
  declare image_url: string | null;
  declare display_order: number;
  declare is_active: boolean;

  static initModel(sequelize: Sequelize) {
    MenuItem.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },

        menu_id: {
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

        base_price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },

        image_url: {
          type: DataTypes.STRING,
          allowNull: true,
        },

        display_order: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },

        is_active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
      },
      {
        sequelize,
        tableName: "menu_items",
        modelName: "MenuItem",
        underscored: true,
        timestamps: true,
        paranoid: true,
      }
    );
  }
}