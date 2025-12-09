import { Router } from "express";
import {
  getAllEvents,
  getEventById,
  getEventsByBranch,
} from "../controllers/eventController"; // تأكد من استيراد الـ Controller بشكل صحيح

const router = Router();

// GET all events
/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     description: Returns a list of all events
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
 */
router.get("/", getAllEvents); // عرض كل الأحداث

// GET event by ID
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
 *       404:
 *         description: Event not found
 */
router.get("/:eventId", getEventById); // عرض حدث واحد بناءً على الـ ID

// GET events by branch
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
 *       404:
 *         description: Branch not found or no events for the branch
 */
router.get("/branch/:branchId", getEventsByBranch); // عرض الأحداث بناءً على الفرع

export default router; // تصدير الـ Routes
