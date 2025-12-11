// src/routes/event.routes.ts
import { Router } from "express";
import { getAllEvents, getEventById, getEventsByBranch } from "../controllers/eventController"; 

const router = Router();

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     description: Returns a list of all events
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   date:
 *                     type: string
 *                   location:
 *                     type: string
 *                   description:
 *                     type: string
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *                   isActive:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllEvents); // Route to get all events

/**
 * @swagger
 * /events/{eventId}:
 *   get:
 *     summary: Get event by ID
 *     description: Returns the event for a specific ID
 *     parameters:
 *       - name: eventId
 *         in: path
 *         description: ID of the event to fetch
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 date:
 *                   type: string
 *                 location:
 *                   type: string
 *                 description:
 *                   type: string
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                 isActive:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
router.get("/:eventId", getEventById); // Route to get a single event by ID

/**
 * @swagger
 * /events/branch/{branchId}:
 *   get:
 *     summary: Get events by branch
 *     description: Returns a list of events associated with a specific branch
 *     parameters:
 *       - name: branchId
 *         in: path
 *         description: ID of the branch to fetch events
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of events for the branch
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   date:
 *                     type: string
 *                   location:
 *                     type: string
 *                   description:
 *                     type: string
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *                   isActive:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Branch not found or no events for the branch
 *       500:
 *         description: Internal server error
 */
router.get("/branch/:branchId", getEventsByBranch); // Route to get events by branch ID

export default router;
