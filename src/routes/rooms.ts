// src/routes/rooms.routes.ts
import { Router } from "express";
import { getAllRooms, getRoomById, getRoomsByBranch } from "../controllers/roomsController";

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
 *                   branch_id:
 *                     type: string
 *                   price_per_hour:
 *                     type: number
 *                   is_active:
 *                     type: boolean
 *                   name-ar:
 *                     type: string
 *                   name-en:
 *                     type: string
 *                   place_id:
 *                     type: number
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllRooms); // Route to get all rooms

/**
 * @swagger
 * /rooms/{roomId}:
 *   get:
 *     summary: Get a single room by ID
 *     description: Fetches a single room based on its ID.
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         description: The ID of the room to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched the room by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 branch_id:
 *                   type: string
 *                 price_per_hour:
 *                   type: number
 *                 is_active:
 *                   type: boolean
 *                 name-ar:
 *                   type: string
 *                 name-en:
 *                   type: string
 *                 place_id:
 *                   type: number
 *       404:
 *         description: Room not found
 *       500:
 *         description: Internal server error
 */
router.get("/:roomId", getRoomById); // Route to get a room by ID

/**
 * @swagger
 * /rooms/branch/{branchId}:
 *   get:
 *     summary: Get all rooms of a specific branch
 *     description: Fetches all rooms of a specific branch.
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *         description: The ID of the branch.
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
 *                   branch_id:
 *                     type: string
 *                   price_per_hour:
 *                     type: number
 *                   is_active:
 *                     type: boolean
 *                   name-ar:
 *                     type: string
 *                   name-en:
 *                     type: string
 *                   place_id:
 *                     type: number
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Internal server error
 */
router.get("/branch/:branchId", getRoomsByBranch); // Route to get rooms by branch ID

export default router;
