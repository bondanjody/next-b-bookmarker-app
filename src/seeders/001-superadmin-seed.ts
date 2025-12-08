import { QueryInterface } from "sequelize";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export async function up(queryInterface: QueryInterface) {
  const username = process.env.SUPERADMIN_USERNAME || "superadmin";
  const plainPassword = process.env.SUPERADMIN_PASSWORD || "superadmin123"; // ⛔ ganti setelah login pertama
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

  // Hash password
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

  // Insert superadmin
  await queryInterface.bulkInsert("b_bookmarker_users_tbl", [
    {
      username,
      password: hashedPassword,
      role: "B.BM.SUPERADMIN",
      is_active: true,
      created_at: new Date(),
      updated_at: null,
      deleted_at: null,
    },
  ]);
}

export async function down(queryInterface: QueryInterface) {
  // Hapus superadmin
  await queryInterface.bulkDelete("b_bookmarker_users_tbl", {
    username: process.env.SUPERADMIN_USERNAME || "superadmin",
  });
}
