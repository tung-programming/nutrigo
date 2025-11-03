import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// ✅ Extend the Express Request type properly
export interface AuthRequest extends Request {
  user?: any;
  headers: Request["headers"]; // explicitly tell TS to use Express headers
}

const JWT_SECRET = process.env.JWT_SECRET || "nutrigo_secret_key";

export const authenticateUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // ✅ Safe header access
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "No token provided, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
