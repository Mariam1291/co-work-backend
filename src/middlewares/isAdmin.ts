// src/middlewares/isAdmin.ts
import { Request, Response, NextFunction } from "express";
import admin from "../config/firebase";
import { AuthenticatedRequest } from "./auth"; // ← ده الصحيح بالظبط

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthenticatedRequest;

  if (!authReq.user) {
    return res.status(401).json({ message: "غير مصرح - يجب تسجيل الدخول أولاً" });
  }

  try {
    const userRecord = await admin.auth().getUser(authReq.user.uid);

    if (userRecord.customClaims?.admin === true) {
      return next();
    } else {
      return res.status(403).json({ message: "ممنوع: صلاحيات الأدمن فقط" });
    }
  } catch (error) {
    console.error("خطأ في التحقق من صلاحية الأدمن:", error);
    return res.status(403).json({ message: "فشل التحقق من صلاحيات الأدمن" });
  }
};