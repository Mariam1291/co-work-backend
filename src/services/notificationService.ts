// src/services/notificationService.ts

import { db } from "../config/firebase";

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
