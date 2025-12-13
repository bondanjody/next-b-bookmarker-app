// lib/auth.ts
import jwt from "jsonwebtoken";
import { NextApiRequest } from "next";

const secret = process.env.JWT_SECRET as string;

export function signToken(payload: object) {
  return jwt.sign(payload, secret, { expiresIn: "1d" });
}

export function verifyToken(req: NextApiRequest) {
  const cookie = req.headers.cookie;
  if (!cookie) return null;

  const token = cookie.split("token=")[1];
  if (!token) return null;

  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}
