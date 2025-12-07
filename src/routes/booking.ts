// src/routes/booking.routes.ts
import { Router } from "express";
import { createBooking } from "../controllers/bookingController"; 
import { verifyAuth } from "../middlewares/verifyAuth";  // التأكد من المسار الصحيح

const router = Router();

// إنشاء حجز جديد (لليوزر العادي)
router.post("/create", verifyAuth, createBooking);

module.exports = router;
