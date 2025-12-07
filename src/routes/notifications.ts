// src/routes/notification.ts
import express, { Request, Response } from "express";
import Backendless from "backendless";

const router = express.Router();
const Notifications = Backendless.Data.of("notification");

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
    const builder = Backendless.DataQueryBuilder.create()
      .setWhereClause(`userId = '${userId}'`)
      .setSortBy(["createdAt DESC"]);

    if (onlyUnread) {
      builder.setWhereClause(`userId = '${userId}' AND isRead = false`);
    }

    const notifications = await Notifications.find(builder);

    // تحويل التواريخ لشكل ISO عادي لو محتاج
    const formatted = notifications.map((n: any) => ({
      id: n.objectId,
      text: n.text,
      type: n.type || "general",
      relatedId: n.relatedId || null,
      isRead: n.isRead || false,
      createdAt: n.createdAt,
    }));

    res.json({ notifications: formatted });
  } catch (err) {
    console.error("getNotifications error:", err);
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
    await Notifications.save({ objectId: notiId, isRead: true });
    res.json({ success: true });
  } catch (err) {
    console.error("markNotificationAsRead error:", err);
    res.status(500).json({ message: "فشل تحديث حالة الإشعار" });
  }
});

module.exports = router; // مهم جدًا
