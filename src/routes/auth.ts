// src/routes/auth.routes.ts
import { Router } from "express";
import { verifyAuth } from "../middlewares/verifyAuth";

const router = Router();

// المسار للتأكد من بيانات المستخدم بعد التوثيق
router.get("/me", verifyAuth, async (req: any, res) => {
  try {
    const user = req.user;  // بيانات المستخدم تم إضافتها بواسطة verifyAuth

    res.json({ user });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router; // تأكد من تصديره هكذا
