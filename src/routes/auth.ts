import { Router } from "express";
import  admin  from "../config/firebase"; // من ملف firebase.ts

const router = Router();

/**
 * GET /auth/me
 * يرجّع بيانات المستخدم من الـ Token
 */
router.get("/me", async (req: any, res) => {
  try {
    const uid = req.userId; // جاي من verifyToken middleware

    const snap = await admin.firestore().collection("users").doc(uid).get();
    if (!snap.exists) return res.status(404).json({ message: "User not found" });

    return res.json({ user: snap.data() });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
