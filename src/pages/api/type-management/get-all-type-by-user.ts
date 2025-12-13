import { NextApiRequest, NextApiResponse } from "next";
import { Type } from "@/models";
import { authorize } from "@/middlewares/rbac";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({
      status: false,
      message: "Method Not Allowed",
    });
  }

  try {
    // ⬇ user dari JWT (di-inject oleh authorize middleware)
    const user = (req as any).user;

    const types = await Type.findAll({
      where: {
        is_active: true,
        created_by: user.username,
      },
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      status: true,
      message: "Active types fetched successfully.",
      data: types,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      message: "FAILED to fetch types.",
      error: error.message,
    });
  }
}

// ⬇ Semua role boleh mengakses
export default authorize(
  ["B.BM.USER", "B.BM.ADMIN", "B.BM.SUPERADMIN"],
  handler
);
