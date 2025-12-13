import { NextApiRequest, NextApiResponse } from "next";
import { Source } from "@/models";
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

    const sources = await Source.findAll({
      where: {
        is_active: true,
        created_by: user.username,
      },
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      status: true,
      message: "Active sources fetched successfully.",
      data: sources,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      message: "FAILED to fetch sources.",
      error: error.message,
    });
  }
}

// ⬇ Semua role boleh mengakses
export default authorize(
  ["B.BM.USER", "B.BM.ADMIN", "B.BM.SUPERADMIN"],
  handler
);
