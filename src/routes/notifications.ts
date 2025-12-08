import express, { Request, Response } from "express";
import { db } from "../config/firebase"; // تأكد من استيراد db بشكل صحيح

const router = express.Router();

// ==========================================
// 1. جلب إشعارات المستخدم
// ==========================================
router.get("/my-notifications", async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  const onlyUnread = req.query.onlyUnread === "true";

  if (!userId) {
    return res.status(400).json({ message: "userId مطلوب" });
  }

  try {
    // بناء استعلام Firestore
    let query = db.collection("notifications").where("userId", "==", userId).orderBy("createdAt", "desc");

    if (onlyUnread) {
      query = query.where("isRead", "==", false);
    }

    const snapshot = await query.get();
    
    const notifications = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        text: data.text,
        type: data.type || "general",
        relatedId: data.relatedId || null,
        isRead: data.isRead || false,
        createdAt: data.createdAt,
      };
    });

    res.json({ notifications });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "خطأ في جلب الإشعارات" });
  }
});

// ==========================================
// 2. تحديد إشعار كـ مقروء
// ==========================================
router.post("/mark-as-read", async (req: Request, res: Response) => {
  const notiId = req.query.notiId as string || req.body.notiId;

  if (!notiId) {
    return res.status(400).json({ message: "notiId مطلوب" });
  }

  try {
    // تحديث حالة الإشعار
    await db.collection("notifications").doc(notiId).update({
      isRead: true,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).json({ message: "فشل تحديث حالة الإشعار" });
  }
});

export default router;
