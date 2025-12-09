// src/routes/admin.routes.ts
import { Router } from 'express';
import { setAdmin, getPendingBookings, approveBooking, rejectBooking } from '../controllers/admincontroller';  // التأكد من الاستيراد الصحيح
import { verifyAuth } from "../middlewares/verifyAuth";
import { isAdmin } from "../middlewares/isAdmin";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management endpoints
 */

/**
 * @swagger
 * /api/admin/set-admin:
 *   post:
 *     summary: Set a user as admin
 *     description: Grant admin privileges to a user.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *                 description: The UID of the user to be granted admin privileges.
 *     responses:
 *       200:
 *         description: Admin privileges granted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 uid:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Invalid UID or missing parameter
 *       500:
 *         description: Internal server error
 */
router.post("/set-admin", verifyAuth, isAdmin, setAdmin);

/**
 * @swagger
 * /api/admin/pending-bookings:
 *   get:
 *     summary: Get pending bookings
 *     description: Retrieve all bookings that are pending approval.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: List of pending bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   userEmail:
 *                     type: string
 *                   branchName:
 *                     type: string
 *                   roomName:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *                   startTime:
 *                     type: string
 *                   endTime:
 *                     type: string
 *                   totalPrice:
 *                     type: number
 *                   depositScreenshotUrl:
 *                     type: string
 *       500:
 *         description: Failed to fetch bookings
 */
router.get("/pending-bookings", getPendingBookings);

/**
 * @swagger
 * /api/admin/booking/{id}/approve:
 *   post:
 *     summary: Approve a booking
 *     description: Approve a pending booking and set it to confirmed.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the booking to approve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking successfully approved
 *       500:
 *         description: Failed to approve the booking
 */
router.post("/booking/:id/approve", approveBooking);

/**
 * @swagger
 * /api/admin/booking/{id}/reject:
 *   post:
 *     summary: Reject a booking
 *     description: Reject a booking with a reason.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the booking to reject
 *         schema:
 *           type: string
 *       - in: body
 *         name: reason
 *         required: false
 *         description: The reason for rejecting the booking
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking successfully rejected
 *       500:
 *         description: Failed to reject the booking
 */
router.post("/booking/:id/reject", rejectBooking);

export default router; // تأكد من تصديره هكذا

