/*
This table is for data such as : YouTube Video, TikTok Post, Article, Journal, Book, etc.
*/

import { QueryInterface, DataTypes } from "sequelize";

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable("b_bookmarker_items_tbl", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // ✅ auto UUID
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
      defaultValue: false,
    },

    notes: {
      type: DataTypes.STRING(200),
      allowNull: true, // ✅ catatan boleh kosong
    },

    // ========================
    // ✅ RELATIONS (FOREIGN KEY)
    // ========================

    category: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "b_bookmarker_categories_tbl",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    source: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "b_bookmarker_sources_tbl",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    type: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "b_bookmarker_types_tbl",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    creator: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "b_bookmarker_creators_tbl",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    // ========================
    // ✅ STATUS & TIMESTAMP
    // ========================

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // ✅ auto timestamp
    },

    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // ========================
    // ✅ AUDIT TRAIL (USER)
    // ========================

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
  await queryInterface.dropTable("b_bookmarker_items_tbl");
}
