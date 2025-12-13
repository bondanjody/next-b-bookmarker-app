import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/models";
import { authorize } from "@/middlewares/rbac";
import bcrypt from "bcrypt";

const ALLOWED_ROLES = ["B.BM.USER", "B.BM.ADMIN"];

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: false,
      message: "Method Not Allowed",
    });
  }

  const { username, password, role } = req.body;
  const authUser = (req as any).user;

  try {
    // ================================
    // 🔍 VALIDASI INPUT DASAR
    // ================================
    if (!username || !password || !role) {
      return res.status(400).json({
        status: false,
        message: "username, password, dan role wajib diisi",
      });
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        status: false,
        message: "Role tidak valid",
      });
    }

    // ================================
    // 🔍 VALIDASI USERNAME UNIK
    // ================================
    const existingUser = await User.findOne({
      where: { username },
    });

    if (existingUser) {
      return res.status(409).json({
        status: false,
        message: "Username sudah terdaftar",
      });
    }

    // ================================
    // 🔐 HASH PASSWORD
    // ================================
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_SALT_ROUNDS) || 10
    );

    // ================================
    // 💾 INSERT DATA
    // ================================
    const newUser = await User.create({
      username,
      password: hashedPassword,
      role,
      is_active: true,
    });

    return res.status(201).json({
      status: true,
      message: "User data saved.",
      data: {
        username: newUser.dataValues.username,
        role: newUser.dataValues.role,
      },
    });
  } catch (error: any) {
    console.error("ADD USER ERROR:", error);

    return res.status(500).json({
      status: false,
      message: "FAILED to save user data.",
      error: error.message,
    });
  }
}

// ⬇ RBAC: hanya ADMIN & SUPERADMIN
export default authorize(["B.BM.ADMIN", "B.BM.SUPERADMIN"], handler);
