import { Model, DataTypes, Sequelize, type Optional } from "sequelize";

export interface AdminLogAttributes {
  id: string;
  userId: string;
  action: string;
  targetType: string;
  targetId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AdminLogCreationAttributes
  extends Optional<AdminLogAttributes, "id"> {}

export class AdminLog extends Model<
  AdminLogAttributes,
  AdminLogCreationAttributes
> implements AdminLogAttributes {
  declare id: string;
  declare userId: string;
  declare action: string;
  declare targetType: string;
  declare targetId: string;

  static initModel(sequelize: Sequelize): typeof AdminLog {
    AdminLog.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },

        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
          onDelete: "CASCADE",
        },

        action: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        targetType: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        targetId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "admin_logs",
        timestamps: true,
        underscored: true,
      }
    );

    return AdminLog;
  }
}