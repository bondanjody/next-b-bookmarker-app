import { NextApiRequest, NextApiResponse } from "next";
import { Item, Category, Source, Type, Creator } from "@/models";
import { authorize } from "@/middlewares/rbac";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({
      status: false,
      message: "Method Not Allowed",
    });
  }

  try {
    const user = (req as any).user;

    const items = await Item.findAll({
      where: {
        is_active: true,
        created_by: user.username,
      },
      include: [
        {
          model: Category,
          as: "category_data",
          attributes: ["id", "name"],
        },
        {
          model: Source,
          as: "source_data",
          attributes: ["id", "name"],
        },
        {
          model: Type,
          as: "type_data",
          attributes: ["id", "name"],
        },
        {
          model: Creator,
          as: "creator_data",
          attributes: ["id", "name"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      status: true,
      message: "Active items fetched successfully.",
      data: items,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      message: "FAILED to fetch items.",
      error: error.message,
    });
  }
}

// ⬇ Semua role boleh
export default authorize(
  ["B.BM.USER", "B.BM.ADMIN", "B.BM.SUPERADMIN"],
  handler
);
