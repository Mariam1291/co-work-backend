// src/middlewares/verifyAuth.ts
import { Request, Response, NextFunction } from "express";
import admin from "../config/firebase"; // تأكد من المسار الصحيح

// تعريف واجهة لطلب مع إضافة `user`
export interface AuthenticatedRequest extends Request {
  user: {
    uid: string;
    email?: string | null;
    isAdmin: boolean;
  };
}

export const verifyAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "غير مصرح - لا يوجد توكن" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    // إضافة بيانات الـ user إلى الـ request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      isAdmin: decodedToken.admin || false,  // تأكد من أنك تقوم بإعداد الـ admin في التوكن
    };

    return next();
  } catch (error) {
    console.error("خطأ في التحقق من التوكن:", error);
    return res.status(401).json({ message: "توكن غير صالح أو منتهي الصلاحية" });
  }
};
