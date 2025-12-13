// pages/api/auth/me.ts
import { verifyToken } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = verifyToken(req);
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  res.status(200).json(user);
}
