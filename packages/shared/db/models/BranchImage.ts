import { Model,DataTypes, type Sequelize, type Optional } from "sequelize";

export interface BranchImageAttributes {
    id: string,
    branchId: string,
    url: string,
    type: string,
}

export interface BranchImageCreationAttributes
  extends Optional<BranchImageAttributes, "id">{}

export class BranchImage
  extends Model<BranchImageAttributes,BranchImageCreationAttributes>
  implements BranchImageAttributes
{
    declare id: string;
    declare branchId: string;
    declare url: string;
    declare type: string;

    static initModel(sequelize: Sequelize) {
        BranchImage.init(
          {
            id: {
              type: DataTypes.UUID,
              defaultValue: DataTypes.UUIDV4,
              primaryKey: true,
            },
            branchId: {
              type: DataTypes.UUID,
              allowNull: false,
            },
            url: {
              type: DataTypes.STRING,
              allowNull: false
            },
            type: {
              type: DataTypes.STRING,
              allowNull: false,
            },
          },
          {
            sequelize,
            tableName: "branch_images",
            modelName: "BranchImage",
            underscored: true,
            timestamps: true,
            paranoid: true,
          }
        );
    }
}