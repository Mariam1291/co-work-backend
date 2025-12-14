import { Router } from "express";
import { createBooking } from "../controllers/bookingController";
import { verifyAuth } from "../middlewares/verifyAuth"; // تأكد من أن هذا المسار صحيح

const router = Router();

// مسار إنشاء حجز جديد
// يستخدم verifyAuth للتأكد من أن المستخدم مسجل دخوله
router.post("/create", verifyAuth, createBooking);

export default router;