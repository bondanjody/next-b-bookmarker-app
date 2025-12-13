import { NextApiRequest, NextApiResponse } from "next";
import { Category } from "@/models";
import { authorize } from "@/middlewares/rbac";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: false,
      message: "Method Not Allowed",
    });
  }

  const { name } = req.body;

  const user = (req as any).user;

  try {
    // ================================
    // 🔍 VALIDASI INPUT DASAR
    // ================================
    if (!name) {
      return res.status(400).json({
        status: false,
        message: "Kolom 'name' wajib diisi.",
      });
    }

    // ================================
    // 🔍 VALIDASI NAME UNIK
    // ================================
    const duplicateName = await Category.findOne({
      where: { name, created_by: user.username },
    });

    if (duplicateName) {
      return res.status(409).json({
        status: false,
        message: `Category dengan name '${name}' sudah ada.`,
      });
    }

    // ================================
    // 💾 INSERT DATA
    // ================================

    const newCategory = await Category.create({
      name,
      created_by: user.username,
    });

    return res.status(201).json({
      status: true,
      message: "Category data saved.",
      data: newCategory,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      message: "FAILED to save category data.",
      error: error.message,
    });
  }
}

// ⬇ DAFTAR ROLE YANG DIIZINKAN
export default authorize(
  ["B.BM.USER", "B.BM.ADMIN", "B.BM.SUPERADMIN"],
  handler
);
