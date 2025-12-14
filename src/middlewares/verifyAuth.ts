import { Request, Response, NextFunction } from "express";
import { firebaseAdmin as admin } from "../config/firebase";

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string | null;
    isAdmin: boolean;
  };
}

export const verifyAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // ✅ شرط صحيح
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "غير مصرح - لا يوجد توكن",
    });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      isAdmin: Boolean(decodedToken.admin),
    };

    next();
  } catch (error) {
    console.error("خطأ في التحقق من التوكن:", error);
    return res.status(401).json({
      message: "توكن غير صالح أو منتهي الصلاحية",
    });
  }
};