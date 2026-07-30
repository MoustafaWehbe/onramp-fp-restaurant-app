import { Model, DataTypes, type Sequelize, type Optional } from "sequelize";

export interface ReviewAttributes {
    id: string,
    user_id : string,
    branch_id : string,
    comment: string,
    rating: number,
}

export interface ReviewCreationAttributes 
  extends Optional<ReviewAttributes, "id"> {}

export class Review
  extends Model<ReviewAttributes,ReviewCreationAttributes>
  implements ReviewAttributes
{
    declare id: string;
    declare user_id: string;
    declare branch_id: string;
    declare comment: string;
    declare rating: number;

    static initModel(sequelize: Sequelize) {
        Review.init(
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
            branch_id: {
              type: DataTypes.UUID,
              allowNull: false,
            },
            comment: {
              type: DataTypes.STRING,
              allowNull: false,
            },
            rating: {
                type: DataTypes.TINYINT,
                allowNull: false,
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