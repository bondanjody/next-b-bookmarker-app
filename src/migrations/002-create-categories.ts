/*
This table is for data such as : Programming, Self Improvement, etc.
*/

import { QueryInterface, DataTypes } from "sequelize";

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable("b_bookmarker_categories_tbl", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // ✅ WAJIB
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // ✅ WAJIB
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
      references: {
        model: "b_bookmarker_users_tbl",
        key: "username",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    updated_by: {
      type: DataTypes.STRING(75),
      allowNull: true,
      references: {
        model: "b_bookmarker_users_tbl",
        key: "username",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },

    deleted_by: {
      type: DataTypes.STRING(75),
      allowNull: true,
      references: {
        model: "b_bookmarker_users_tbl",
        key: "username",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable("b_bookmarker_categories_tbl");
}
