import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export interface AuthUser {
  username: string;
  role: string;
}

function getUser(req: NextApiRequest): AuthUser | null {
  try {
    const token = req.cookies.token;
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;

    return decoded;
  } catch {
    return null;
  }
}

/**
 * Middleware RBAC
 * Usage: export default authorize(["ADMIN"], handler)
 */
export function authorize(allowedRoles: string[], handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const user = getUser(req);

    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        status: false,
        message: "Forbidden: Role tidak diizinkan",
      });
    }

    // ⬇ inject user ke request untuk di pakai di handler
    (req as any).user = user;

    return handler(req, res);
  };
}
