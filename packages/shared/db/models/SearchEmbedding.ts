import { Model, DataTypes, type Sequelize, type Optional } from "sequelize";

export interface SearchEmbeddingAttributes {
  id: string;
  entityType: string;
  entityId: string;
  content: string;
  embedding?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SearchEmbeddingCreationAttributes
  extends Optional<SearchEmbeddingAttributes, "id"> {}

export class SearchEmbedding
  extends Model<
    SearchEmbeddingAttributes,
    SearchEmbeddingCreationAttributes
  >
  implements SearchEmbeddingAttributes {
  declare id: string;
  declare entityType: string;
  declare entityId: string;
  declare content: string;
  declare embedding?: string | null;
  declare metadata?: Record<string, unknown> | null;
  declare createdAt?: Date;
  declare updatedAt?: Date;

  static initModel(sequelize: Sequelize) {
    SearchEmbedding.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },

        entityType: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        entityId: {
          type: DataTypes.UUID,
          allowNull: false,
        },

        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },

        embedding: {
          type: "VECTOR(768)" as any,
          allowNull: true,
        },

        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "search_embeddings",
        modelName: "SearchEmbedding",
        underscored: true,
        timestamps: true,

        indexes: [
          {
            unique: true,
            fields: ["entity_type", "entity_id"],
          },
        ],
      }
    );
  }
}