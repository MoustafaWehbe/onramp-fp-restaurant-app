import { Model, DataTypes, type Sequelize, type Optional } from "sequelize";

export interface BranchAttributes {
  id: string,
  restaurantId: string,
  name: string,
  slug: string,
  city: string,
  address: string,
  latitude: string,
  longitude: string,
  phone: string | null,
  opening_hours: string,
  review_count: number,
  average_rating: number,
}

export interface BranchCreationAttributes
  extends Optional<BranchAttributes, "id" | "phone"> { }

export class Branch
  extends Model<BranchAttributes, BranchCreationAttributes>
  implements BranchAttributes {
  declare id: string;
  declare restaurantId: string;
  declare name: string;
  declare slug: string;
  declare city: string;
  declare address: string;
  declare latitude: string;
  declare longitude: string;
  declare phone: string | null;
  declare opening_hours: string;
  declare review_count: number;
  declare average_rating: number;

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
        slug: {
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
          type: DataTypes.DECIMAL(10, 8),
          allowNull: false,
        },
        longitude: {
          type: DataTypes.DECIMAL(11, 8),
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
        review_count: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        average_rating: {
          type: DataTypes.DECIMAL(3, 2),
          allowNull: false,
          defaultValue: 0.00,
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