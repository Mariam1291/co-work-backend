// src/controllers/notificationsController.ts
import { Request, Response } from "express";
import { db } from "../config/firebase";

// جلب إشعارات المستخدم
export const sendNotification = async (userId: string, notificationType: string, reason?: string) => {
  try {
    // جلب بيانات الإشعار من Firestore بناءً على نوع الإشعار
    const notificationDoc = await db.collection("notification").doc(notificationType).get();

    if (!notificationDoc.exists) {
      console.log("Notification type not found");
      return;
    }

    const notificationData = notificationDoc.data();
    const titleAr = notificationData?.title_ar || "Unknown title";
    const titleEn = notificationData?.title_en || "Unknown title";
    const bodyAr = notificationData?.body_ar || "Unknown body";
    const bodyEn = notificationData?.body_en || "Unknown body";

    // إذا كان هناك سبب (مثل رفض الدفع)، يمكن تخصيص الرسالة
    const finalBodyAr = bodyAr.replace("{{reason}}", reason || "");
    const finalBodyEn = bodyEn.replace("{{reason}}", reason || "");

    // إرسال الإشعار للمستخدم
    await db.collection("notifications").add({
      user_id: userId,
      title_ar: titleAr,
      title_en: titleEn,
      body_ar: finalBodyAr,
      body_en: finalBodyEn,
      notification_id: notificationType,
      isRead: false,
      createdAt: new Date(),
    });

    console.log("Notification sent successfully");
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

export const getUserNotifications = async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  const onlyUnread = req.query.onlyUnread === "true";

  if (!userId) {
    return res.status(400).json({ message: "userId مطلوب" });
  }

  try {
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
};

// تحديد إشعار كـ مقروء
export const markNotificationAsRead = async (req: Request, res: Response) => {
  const notiId = req.query.notiId as string || req.body.notiId;

  if (!notiId) {
    return res.status(400).json({ message: "notiId مطلوب" });
  }

  try {
    await db.collection("notifications").doc(notiId).update({
      isRead: true,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).json({ message: "فشل تحديث حالة الإشعار" });
  }
};
