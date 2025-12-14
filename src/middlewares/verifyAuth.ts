// src/middlewares/verifyAuth.ts
import { Request, Response, NextFunction } from "express";
import { firebaseAdmin as admin } from "../config/firebase";

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string | null;
  };
}

export const verifyAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email || null,
    };
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
};