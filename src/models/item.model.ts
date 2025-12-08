import { Model, DataTypes, Optional, Sequelize } from "sequelize";
import { User } from "./user.model";
import { Category } from "./category.model";
import { Creator } from "./creator.model";
import { Source } from "./source.model";
import { Type } from "./type.model";

// ==============================
// 1️⃣ Interface atribut Item
// ==============================
export interface ItemAttributes {
  id: string;
  title: string;
  link: string;
  is_done: boolean;
  notes: string;
  category: string; // FK ke Category.id
  source: string; // FK ke Source.id
  type: string; // FK ke Type.id
  creator: string; // FK ke Creator.id
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
  created_by: string; // FK ke User.username
  updated_by?: string;
  deleted_by?: string | null;
}

// ==============================
// 2️⃣ Atribut opsional saat create
// ==============================
export interface ItemCreationAttributes
  extends Optional<
    ItemAttributes,
    | "id"
    | "is_done"
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
export class Item
  extends Model<ItemAttributes, ItemCreationAttributes>
  implements ItemAttributes
{
  public id!: string;
  public title!: string;
  public link!: string;
  public is_done!: boolean;
  public notes!: string;
  public category!: string;
  public source!: string;
  public type!: string;
  public creator!: string;
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
export default function initItemModel(sequelize: Sequelize): typeof Item {
  Item.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      link: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      is_done: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      notes: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      category: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      source: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      type: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      creator: {
        type: DataTypes.UUID,
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
      tableName: "b_bookmarker_items_tbl",
      modelName: "Item",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true,
      deletedAt: "deleted_at",
    }
  );

  // ==============================
  // 5️⃣ Relasi / Associations
  // ==============================
  Item.belongsTo(User, { foreignKey: "created_by", as: "creator_user" });
  Item.belongsTo(Category, { foreignKey: "category", as: "category_data" });
  Item.belongsTo(Creator, { foreignKey: "creator", as: "creator_data" });
  Item.belongsTo(Source, { foreignKey: "source", as: "source_data" });
  Item.belongsTo(Type, { foreignKey: "type", as: "type_data" });

  return Item;
}
