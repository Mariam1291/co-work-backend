// src/routes/bookingRoutes.ts
import { Router } from "express";
import { createBooking, deleteBooking, updateBookingStatus, checkRoomAvailability } from "../controllers/bookingController";

const router = Router();

/**
 * @swagger
 * /api/bookings/create:
 *   post:
 *     summary: Create a new booking
 *     description: Creates a new booking for a room after validating availability
 *     responses:
 *       200:
 *         description: Booking created successfully
 *       400:
 *         description: Invalid request
 */
router.post("/create", createBooking);

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Delete a booking
 *     description: Deletes a booking based on the provided ID
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *       404:
 *         description: Booking not found
 */
router.delete("/:id", deleteBooking);

/**
 * @swagger
 * /api/bookings/{id}/status:
 *   post:
 *     summary: Update booking status
 *     description: Updates the status of a booking to approved/rejected
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 */
router.post("/:id/status", updateBookingStatus);

/**
 * @swagger
 * /api/bookings/check-availability:
 *   post:
 *     summary: Check room availability
 *     description: Verifies if a room is available for a given time slot
 *     responses:
 *       200:
 *         description: Room is available
 *       409:
 *         description: Room is not available
 */
router.post("/check-availability", checkRoomAvailability);

export default router;
