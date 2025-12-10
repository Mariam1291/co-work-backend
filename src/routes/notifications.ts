// src/routes/notificationsRoutes.ts
import { Router } from "express";
import { getUserNotifications, markNotificationAsRead } from "../controllers/notificationcontroller";

const router = Router();

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
router.get("/my-notifications", getUserNotifications);

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
router.post("/mark-as-read", markNotificationAsRead);

export default router;
