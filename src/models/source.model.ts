import { Model, DataTypes, Optional, Sequelize } from "sequelize";

// ==============================
// 1️⃣ Interface atribut Source
// ==============================
export interface SourceAttributes {
  id: string;
  name: string;
  link: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
  created_by: string;
  updated_by?: string;
  deleted_by?: string | null;
}

// ==============================
// 2️⃣ Atribut opsional saat create
// ==============================
export interface SourceCreationAttributes
  extends Optional<
    SourceAttributes,
    | "id"
    | "is_active"
    | "created_at"
    | "updated_at"
    | "deleted_at"
    | "updated_by"
    | "deleted_by"
  > {}

// ==============================
// 3️⃣ Model class
// ==============================
export class Source
  extends Model<SourceAttributes, SourceCreationAttributes>
  implements SourceAttributes
{
  public id!: string;
  public name!: string;
  public link!: string;
  public is_active!: boolean;
  public created_by!: string;
  public updated_by!: string;
  public deleted_by!: string | null;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null;
}

// ==============================
// 4️⃣ Init model function
// ==============================
export default function initSourceModel(sequelize: Sequelize): typeof Source {
  Source.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4, // auto-generate UUID
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      link: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.STRING(75),
        allowNull: false,
      },
      updated_by: {
        type: DataTypes.STRING(75),
        allowNull: true,
      },
      deleted_by: {
        type: DataTypes.STRING(75),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "b_bookmarker_sources_tbl",
      modelName: "Source",

      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",

      paranoid: true, // untuk deleted_at
      deletedAt: "deleted_at",
    }
  );

  return Source;
}
