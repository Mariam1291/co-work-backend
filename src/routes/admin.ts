// src/routes/admin.routes.ts
import { Router } from 'express';
import { setAdmin, getPendingBookings, approveBooking, rejectBooking } from '../controllers/admincontroller';  // التأكد من الاستيراد الصحيح
import { verifyAuth } from "../middlewares/verifyAuth";
import { isAdmin } from "../middlewares/isAdmin";

const router = Router();

// إضافة أدمن
router.post('/set-admin', verifyAuth, isAdmin, setAdmin);

// الحجز المعلق
router.use(verifyAuth, isAdmin); // التأكد من أن جميع الـ routes التالية فقط للأدمن
router.get("/pending-bookings", getPendingBookings);
router.post("/booking/:id/approve", approveBooking);
router.post("/booking/:id/reject", rejectBooking);
export default router; // تأكد من تصديره هكذا

