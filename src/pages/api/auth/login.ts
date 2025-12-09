import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../../models";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: false,
      message: "Method Not Allowed",
    });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: false,
        message: "Username dan password wajib diisi",
      });
    }

    const user = await User.findOne({
      where: { username, is_active: true },
    });

    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Username atau password salah",
      });
    }
    console.log("Nilai user : ", user);

    const isMatch = await bcrypt.compare(password, user.dataValues.password);
    if (!isMatch) {
      return res.status(401).json({
        status: false,
        message: "Username atau password salah",
      });
    }

    // ✅ JWT YANG BENAR - TANPA TYPE CAST ANEH
    const token = jwt.sign(
      {
        username: user.dataValues.username,
        role: user.dataValues.role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      }
    );

    return res.status(200).json({
      status: true,
      message: "Login berhasil",
      token,
      user: {
        username: user.dataValues.username,
        role: user.dataValues.role,
        is_active: user.dataValues.is_active,
        created_at: user.dataValues.created_at,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}
