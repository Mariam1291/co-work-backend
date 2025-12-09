import { Router } from "express";
import {
  getAllEvents,
  getEventById,
  getEventsByBranch,
} from "../controllers/eventController"; // استيراد الـ Controller

const router = Router();

// GET all events
router.get("/", getAllEvents); // عرض كل الأحداث

// GET event by ID
router.get("/:eventId", getEventById); // عرض حدث واحد بناءً على الـ ID

// GET events by branch
router.get("/branch/:branchId", getEventsByBranch); // عرض الأحداث بناءً على الفرع

export default router; // تصدير الـ Routes
