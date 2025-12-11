// src/routes/rooms.routes.ts
import { Router } from "express";
import { getAllRooms, getRoomById, getRoomsByBranch } from "../controllers/roomsController"; 
import { checkRoomAvailability } from "../controllers/bookingController";

const router = Router();

/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Get all rooms
 *     description: Fetches all rooms from the database.
 *     responses:
 *       200:
 *         description: Successfully fetched all rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   nameAr:
 *                     type: string
 *                   nameEn:
 *                     type: string
 *                   pricePerHour:
 *                     type: number
 *                   isActive:
 *                     type: boolean
 *                   placeId:
 *                     type: string
 *                   capacity:
 *                     type: number
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 */
router.get("/", getAllRooms);

/**
 * @swagger
 * /rooms/{roomId}:
 *   get:
 *     summary: Get a single room by ID
 *     description: Fetches a single room from the database based on roomId.
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         description: The ID of the room to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched the room
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 nameAr:
 *                   type: string
 *                 nameEn:
 *                   type: string
 *                 pricePerHour:
 *                   type: number
 *                 isActive:
 *                   type: boolean
 *                 placeId:
 *                   type: string
 *                 capacity:
 *                   type: number
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: Room not found
 */
router.get("/:roomId", getRoomById);

/**
 * @swagger
 * /rooms/branch/{branchId}:
 *   get:
 *     summary: Get all rooms by branch
 *     description: Fetches rooms for a specific branch.
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *         description: The ID of the branch to fetch rooms for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched rooms for the branch
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   nameAr:
 *                     type: string
 *                   nameEn:
 *                     type: string
 *                   pricePerHour:
 *                     type: number
 *                   isActive:
 *                     type: boolean
 *                   placeId:
 *                     type: string
 *                   capacity:
 *                     type: number
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Internal server error
 */
router.get("/branch/:branchId", getRoomsByBranch);

/**
 * @swagger
 * /rooms/check-availability:
 *   post:
 *     summary: Check room availability
 *     description: Checks if a room is available for the specified time slot.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: string
 *                 description: The ID of the room to check availability for
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The date to check availability for
 *               startTime:
 *                 type: string
 *                 format: time
 *                 description: The start time of the booking
 *               endTime:
 *                 type: string
 *                 format: time
 *                 description: The end time of the booking
 *     responses:
 *       200:
 *         description: Room is available
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 isAvailable:
 *                   type: boolean
 *       409:
 *         description: Room is not available
 *       500:
 *         description: Internal server error
 */
router.post("/check-availability", checkRoomAvailability);

export default router;
