// src/routes/rooms.routes.ts
import { Router } from "express";
import { getAllRooms, getRoomById, getRoomsByBranch } from "../controllers/roomsController"; 
import {checkRoomAvailability} from "../controllers/bookingController"

const router = Router();

// استعراض جميع الغرف
router.get("/", getAllRooms);

// استعراض غرفة حسب الـ ID
router.get("/:roomId", getRoomById);

// استعراض الغرف الخاصة بالفرع
router.get("/branch/:branchId", getRoomsByBranch);

// التحقق من توافر الغرفة
router.post("/check-availability", checkRoomAvailability); 

export default router;
