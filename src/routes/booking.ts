// src/routes/booking.ts
import { Router } from "express";
import { createBooking } from "../controllers/bookingController"; 
import { getAvailableTimes } from "../controllers/bookingController";// ← الصحيح (مش bookingController)
import { verifyAuth } from "../middlewares/auth";
           // ← الصحيح

const router = Router();

// إنشاء حجز جديد (لليوزر العادي)
router.post("/create", verifyAuth, createBooking);
router.get("/available-times", getAvailableTimes);
export default router;