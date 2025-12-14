// src/routes/bookingroutes.ts
import { Router } from "express";
import { createBooking } from "../controllers/bookingController";
import { verifyAuth } from "../middlewares/verifyAuth";

const router = Router();

/**
 * @swagger
 * /api/bookings/create:
 *   post:
 *     summary: Create a new booking
 *     description: Endpoint to create a new booking for a user with available time slot validation.
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: string
 *                 description: ID of the room to book
 *               branchId:
 *                 type: string
 *                 description: ID of the branch where the room is located
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The date for booking (YYYY-MM-DD)
 *               startTime:
 *                 type: string
 *                 format: time
 *                 description: The start time of the booking (12-hour format, e.g., "10:00 AM")
 *               endTime:
 *                 type: string
 *                 format: time
 *                 description: The end time of the booking (12-hour format, e.g., "12:00 PM")
 *               totalPrice:
 *                 type: number
 *                 description: The total price for the booking
 *               depositScreenshot:
 *                 type: string
 *                 description: Base64 encoded image for the deposit screenshot
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 bookingId:
 *                   type: string
 *       400:
 *         description: Bad request (Missing required fields)
 *       409:
 *         description: Conflict (The selected time slot is already booked)
 *       500:
 *         description: Internal Server Error
 */
router.post("/create", verifyAuth, createBooking);
/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Delete a booking
 *     description: Deletes an existing booking by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the booking to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal Server Error
 */

export default router;
