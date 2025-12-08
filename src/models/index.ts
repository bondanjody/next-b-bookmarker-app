import { Sequelize } from "sequelize";
import initUserModel, { User } from "./user.model";
import initCategoryModel, { Category } from "./category.model";
import initCreatorModel, { Creator } from "./creator.model";
import initSourceModel, { Source } from "./source.model";
import initTypeModel, { Type } from "./type.model";
import initItemModel, { Item } from "./item.model";

// ==============================
// 1️⃣ Sequelize instance
// ==============================
const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASS!,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    dialect: "postgres",
    logging: false,
  }
);

// ==============================
// 2️⃣ Init models
// ==============================
export const UserModel = initUserModel(sequelize);
export const CategoryModel = initCategoryModel(sequelize);
export const CreatorModel = initCreatorModel(sequelize);
export const SourceModel = initSourceModel(sequelize);
export const TypeModel = initTypeModel(sequelize);
export const ItemModel = initItemModel(sequelize);

// ==============================
// 3️⃣ Define Associations / Relasi
// ==============================

// --- User ---
// User membuat Item, Category, Creator, Source, Type
UserModel.hasMany(ItemModel, { foreignKey: "created_by", as: "items_created" });
UserModel.hasMany(CategoryModel, {
  foreignKey: "created_by",
  as: "categories_created",
});
UserModel.hasMany(CreatorModel, {
  foreignKey: "created_by",
  as: "creators_created",
});
UserModel.hasMany(SourceModel, {
  foreignKey: "created_by",
  as: "sources_created",
});
UserModel.hasMany(TypeModel, { foreignKey: "created_by", as: "types_created" });

// --- Item ---
ItemModel.belongsTo(UserModel, {
  foreignKey: "created_by",
  as: "creator_user",
});
ItemModel.belongsTo(CategoryModel, {
  foreignKey: "category",
  as: "category_data",
});
ItemModel.belongsTo(CreatorModel, {
  foreignKey: "creator",
  as: "creator_data",
});
ItemModel.belongsTo(SourceModel, { foreignKey: "source", as: "source_data" });
ItemModel.belongsTo(TypeModel, { foreignKey: "type", as: "type_data" });

// --- Category, Creator, Source, Type ---
// Tabel-tabel ini punya banyak Item
CategoryModel.hasMany(ItemModel, { foreignKey: "category", as: "items" });
CreatorModel.hasMany(ItemModel, { foreignKey: "creator", as: "items" });
SourceModel.hasMany(ItemModel, { foreignKey: "source", as: "items" });
TypeModel.hasMany(ItemModel, { foreignKey: "type", as: "items" });

// ==============================
// 4️⃣ Export
// ==============================
export default {
  sequelize,
  User: UserModel,
  Category: CategoryModel,
  Creator: CreatorModel,
  Source: SourceModel,
  Type: TypeModel,
  Item: ItemModel,
};
