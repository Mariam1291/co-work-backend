import express, { Request, Response } from "express";
import { db } from "../config/firebase"; // تأكد من استيراد db بشكل صحيح

const router = express.Router();

// ==========================================
// 1. جلب إشعارات المستخدم
// ==========================================
/**
 * @swagger
 * /notifications/my-notifications:
 *   get:
 *     summary: Get user notifications
 *     description: Fetch all notifications for a specific user, optionally filtering by unread notifications
 *     parameters:
 *       - name: userId
 *         in: query
 *         description: The ID of the user to fetch notifications for
 *         required: true
 *         schema:
 *           type: string
 *       - name: onlyUnread
 *         in: query
 *         description: Filter notifications to only unread ones (optional)
 *         required: false
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: A list of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notifications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       text:
 *                         type: string
 *                       type:
 *                         type: string
 *                       relatedId:
 *                         type: string
 *                       isRead:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Missing userId parameter
 *       500:
 *         description: Error fetching notifications
 */
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
/**
 * @swagger
 * /notifications/mark-as-read:
 *   post:
 *     summary: Mark a notification as read
 *     description: Mark a specific notification as read based on its ID
 *     parameters:
 *       - name: notiId
 *         in: query
 *         description: The ID of the notification to mark as read
 *         required: true
 *         schema:
 *           type: string
 *       - name: notiId
 *         in: body
 *         description: The ID of the notification to mark as read (used if sent in body)
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully marked notification as read
 *       400:
 *         description: Missing notiId parameter
 *       500:
 *         description: Error marking notification as read
 */
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
