// routes/admin.routes.ts
import { Router } from 'express';
import { setAdmin } from '../controllers/admincontroller';  // استيراد الدالة لتعيين الأدمن
import { verifyAuth } from "../middlewares/auth";
import { isAdmin } from "../middlewares/isAdmin";
const router = Router();

router.post('/set-admin', setAdmin);

import {
  getPendingBookings,
  approveBooking,
  rejectBooking,
} from "../controllers/admincontroller";



router.use(verifyAuth, isAdmin); // كل الـ routes تحت دي للأدمن بس

router.get("/pending-bookings", getPendingBookings);
router.post("/booking/:id/approve", approveBooking);
router.post("/booking/:id/reject", rejectBooking);

export default router;
