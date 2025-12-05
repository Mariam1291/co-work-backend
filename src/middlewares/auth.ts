// src/middlewares/verifyAuth.ts
import { Request, Response, NextFunction } from "express";
import admin from "../config/firebase";

// نعمل interface واحد نستخدمه في كل المشروع
export interface AuthenticatedRequest extends Request {
  user: {
    uid: string;
    email?: string | null;
  };
}

export const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "غير مصرح - لا يوجد توكن" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    (req as AuthenticatedRequest).user = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
    };
    return next();
  } catch (error) {
    console.error("خطأ في التحقق من التوكن:", error);
    return res.status(401).json({ message: "توكن غير صالح أو منتهي الصلاحية" });
  }
};