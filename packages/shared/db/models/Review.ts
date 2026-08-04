import { Model, DataTypes, type Sequelize, type Optional } from "sequelize";

export interface ReviewAttributes {
  id: string,
  userId: string,
  branchId: string,
  comment: string,
  rating: number,
  deletedAt?: Date | null;
}

export interface ReviewCreationAttributes
  extends Optional<ReviewAttributes, "id"> { }

export class Review
  extends Model<ReviewAttributes, ReviewCreationAttributes>
  implements ReviewAttributes {
  declare id: string;
  declare userId: string;
  declare branchId: string;
  declare comment: string;
  declare rating: number;
  declare deletedAt?: Date | null;

  static initModel(sequelize: Sequelize) {
    Review.init(
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
        branchId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        comment: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        rating: {
          type: DataTypes.TINYINT,
          allowNull: false,
          validate: {
            min: 1,
            max: 5
          },
        },
      },
      {
        sequelize,
        tableName: "reviews",
        modelName: "Review",
        underscored: true,
        timestamps: true,
        paranoid: true,
      }
    );
  }
}