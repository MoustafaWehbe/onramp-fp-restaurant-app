import { Model, DataTypes, type Sequelize, type Optional } from "sequelize";

export interface BranchMenuItemAttributes {
  id: string;
  branchId: string;
  menuItemId: string;
  customPrice: string | null;
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface BranchMenuItemCreationAttributes
  extends Optional<
    BranchMenuItemAttributes,
    "id" | "customPrice" | "isAvailable" | "deletedAt"
  > {}

export class BranchMenuItem
  extends Model<
    BranchMenuItemAttributes,
    BranchMenuItemCreationAttributes
  >
  implements BranchMenuItemAttributes
{
  declare id: string;
  declare branchId: string;
  declare menuItemId: string;
  declare customPrice: string | null;
  declare isAvailable: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;

  static initModel(sequelize: Sequelize) {
    BranchMenuItem.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },

        branchId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "branches",
            key: "id",
          },
        },

        menuItemId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "menu_items",
            key: "id",
          },
        },

        customPrice: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
        },

        isAvailable: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },

        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "branch_menu_items",
        modelName: "BranchMenuItem",
        underscored: true,
        timestamps: true,
        paranoid: true,
      }
    );
  }
}