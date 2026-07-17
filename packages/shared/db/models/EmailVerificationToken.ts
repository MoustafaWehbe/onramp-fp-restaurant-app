import { Model, DataTypes, Sequelize, type Optional } from "sequelize";

export interface EmailVerificationTokenAttributes {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface EmailVerificationTokenCreationAttributes 
    extends Optional<EmailVerificationTokenAttributes, "id"> {}

export class EmailVerificationToken extends Model<
    EmailVerificationTokenAttributes,
    EmailVerificationTokenCreationAttributes
>
    implements EmailVerificationTokenAttributes
{
    declare id: string;
    declare userId: string;
    declare tokenHash: string;
    declare readonly expiresAt: Date;
    declare readonly updatedAt: Date;

    get isExpired(): boolean {
        return new Date() > this.expiresAt;
    }

    static initModel(sequelize: Sequelize): typeof EmailVerificationToken {
        EmailVerificationToken.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                userId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    references: {model: "users", key:"id" },
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
                tableName: "email_verification_tokens",
                timestamps: true,
                underscored: true,
            },
        );
        return EmailVerificationToken;
    }
}