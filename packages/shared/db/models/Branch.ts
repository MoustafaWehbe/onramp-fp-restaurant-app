import { Model,DataTypes, type Sequelize, type Optional } from "sequelize";

export interface BranchAttributes {
    id: string,
    restaurantId: string,
    name: string,
    city: string,
    address: string,
    latitude: string,
    longitude: string,
    phone: string | null,
    opening_hours: string,
}

export interface BranchCreationAttributes
  extends Optional<BranchAttributes, "id">{}

export class Branch 
  extends Model<BranchAttributes,BranchCreationAttributes>
  implements BranchAttributes
{
  declare id: string;
  declare restaurantId: string;
  declare name: string;
  declare city: string;
  declare address: string;
  declare latitude: string;
  declare longitude: string;
  declare phone: string | null;
  declare opening_hours: string;

  static initModel(sequelize: Sequelize) {
      Branch.init(
        {
          id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
          },
          restaurantId: {
            type: DataTypes.UUID,
            allowNull: false,
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          city: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          address: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          latitude: {
            type: DataTypes.DECIMAL(10,8),
            allowNull: false,
          },
          longitude: {
            type: DataTypes.DECIMAL(11,8),
            allowNull: false,
          },
          phone: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          opening_hours: {
            type: DataTypes.STRING,
            allowNull: false,
          },
        },
        {
            sequelize,
            tableName: "branches",
            modelName: "Branch",
            underscored: true,
            timestamps: true,
        }
      );
  }
}