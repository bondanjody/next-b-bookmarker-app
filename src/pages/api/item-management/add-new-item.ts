import { NextApiRequest, NextApiResponse } from "next";
import { Item, Source, Type, Category, Creator } from "@/models";
import { authorize } from "@/middlewares/rbac";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: false,
      message: "Method Not Allowed",
    });
  }

  const { title, link, is_done, notes, category, source, type, creator } =
    req.body;

  const user = (req as any).user;

  try {
    // ================================
    // 🔍 VALIDASI INPUT DASAR
    // ================================
    if (!title) {
      return res.status(400).json({
        status: false,
        message: "Kolom 'title' wajib diisi.",
      });
    }

    if (!link) {
      return res.status(400).json({
        status: false,
        message: "Kolom 'link' wajib diisi.",
      });
    }

    let parsedIsDone: boolean;

    if (typeof is_done === "boolean") {
      parsedIsDone = is_done;
    } else if (typeof is_done === "string") {
      if (is_done.toLowerCase() === "true") {
        parsedIsDone = true;
      } else if (is_done.toLowerCase() === "false") {
        parsedIsDone = false;
      } else {
        return res.status(400).json({
          status: false,
          message: "Kolom 'is_done' harus bernilai boolean (true / false).",
        });
      }
    } else {
      return res.status(400).json({
        status: false,
        message: "Kolom 'is_done' wajib diisi.",
      });
    }

    if (notes === null || notes === undefined || typeof notes !== "string") {
      return res.status(400).json({
        status: false,
        message: "Kolom 'notes' wajib diisi.",
      });
    }

    if (!category) {
      return res.status(400).json({
        status: false,
        message: "Kolom 'category' wajib diisi.",
      });
    }

    if (!source) {
      return res.status(400).json({
        status: false,
        message: "Kolom 'source' wajib diisi.",
      });
    }

    if (!type) {
      return res.status(400).json({
        status: false,
        message: "Kolom 'type' wajib diisi.",
      });
    }

    if (!creator) {
      return res.status(400).json({
        status: false,
        message: "Kolom 'creator' wajib diisi.",
      });
    }

    // ================================
    // 🔍 VALIDASI isActive Relation
    // ================================
    const isCategoryExist = await Category.findOne({
      where: { id: category, is_active: true, created_by: user.username },
    });
    if (!isCategoryExist) {
      return res.status(400).json({
        status: false,
        message: `Category does NOT exist.`,
      });
    }

    const isSourceExist = await Source.findOne({
      where: { id: source, is_active: true, created_by: user.username },
    });
    if (!isSourceExist) {
      return res.status(400).json({
        status: false,
        message: `Source does NOT exist.`,
      });
    }

    const isTypeExist = await Type.findOne({
      where: { id: type, is_active: true, created_by: user.username },
    });
    if (!isTypeExist) {
      return res.status(400).json({
        status: false,
        message: `Type does NOT exist.`,
      });
    }

    const isCreatorExist = await Creator.findOne({
      where: { id: creator, is_active: true, created_by: user.username },
    });
    if (!isCreatorExist) {
      return res.status(400).json({
        status: false,
        message: `Creator does NOT exist.`,
      });
    }

    // ================================
    // 🔍 VALIDASI NAME UNIK
    // ================================
    const duplicateName = await Item.findOne({
      where: {
        title,
        link,
        category,
        source,
        type,
        creator,
        created_by: user.username,
      },
    });

    if (duplicateName) {
      return res.status(409).json({
        status: false,
        message: `Item is already exist.`,
      });
    }

    // ================================
    // 💾 INSERT DATA
    // ================================

    const newItem = await Item.create({
      title,
      link,
      is_done: parsedIsDone,
      notes,
      category,
      source,
      type,
      creator,
      created_by: user.username,
    });

    return res.status(201).json({
      status: true,
      message: "Item data saved.",
      data: newItem,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      message: "FAILED to save item data.",
      error: error.message,
    });
  }
}

// ⬇ DAFTAR ROLE YANG DIIZINKAN
export default authorize(
  ["B.BM.USER", "B.BM.ADMIN", "B.BM.SUPERADMIN"],
  handler
);
