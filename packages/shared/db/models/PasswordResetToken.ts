import { Model, DataTypes, type Sequelize, type Optional } from "sequelize";

export interface PasswordResetTokenAttributes {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PasswordResetTokenCreationAttributes
  extends Optional<PasswordResetTokenAttributes, "id"> {}

export class PasswordResetToken
  extends Model<
    PasswordResetTokenAttributes,
    PasswordResetTokenCreationAttributes
  >
  implements PasswordResetTokenAttributes
{
  declare id: string;
  declare userId: string;
  declare tokenHash: string;
  declare expiresAt: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  get isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  get isValid(): boolean {
    return !this.isExpired;
  }

  static initModel(sequelize: Sequelize): typeof PasswordResetToken {
    PasswordResetToken.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          unique: true,
          references: {
            model: "users",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        tokenHash: {
          type: DataTypes.STRING(64),
          allowNull: false,
          unique: true,
        },
        expiresAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "password_reset_tokens",
        timestamps: true,
        underscored: true,
      },
    );

    return PasswordResetToken;
  }
}