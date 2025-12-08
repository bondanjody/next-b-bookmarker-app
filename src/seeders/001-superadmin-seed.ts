import { Sequelize } from "sequelize";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import initUserModel from "../models/user.model.ts";

dotenv.config();

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
// 2️⃣ Seeder function
// ==============================
async function seedSuperAdmin() {
  try {
    // Init User model
    const UserModel = initUserModel(sequelize);

    // Sinkronisasi model tanpa drop table
    await sequelize.sync();

    const username = process.env.SUPERADMIN_USERNAME || "superadmin";
    const passwordPlain = process.env.SUPERADMIN_PASSWORD || "superadmin123";

    // Cek apakah superadmin sudah ada
    const existing = await UserModel.findByPk(username);
    if (existing) {
      console.log("Superadmin sudah ada:", username);
      return;
    }

    // Hash password
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
    const hashedPassword = await bcrypt.hash(passwordPlain, saltRounds);

    // Buat superadmin
    await UserModel.create({
      username,
      password: hashedPassword,
      role: "B.BM.SUPERADMIN",
      is_active: true,
    });

    console.log("Superadmin berhasil dibuat:", username);
  } catch (err) {
    console.error("Gagal membuat superadmin:", err);
  } finally {
    await sequelize.close();
  }
}

// ==============================
// 3️⃣ Jalankan seeder
// ==============================
seedSuperAdmin();
