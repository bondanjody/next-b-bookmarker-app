/*
This table is for data such as : YouTube, detikCom, etc.
*/

import { QueryInterface, DataTypes } from "sequelize";

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable("b_bookmarker_sources_tbl", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // ✅ wajib auto-generate
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
      defaultValue: true,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // ✅ wajib agar insert aman
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
  await queryInterface.dropTable("b_bookmarker_sources_tbl");
}
