// src/routes/bookingroutes.ts
import { Router } from "express";
import { createBooking } from "../controllers/bookingController";
import { verifyAuth } from "../middlewares/verifyAuth";

const router = Router();

router.post("/create", verifyAuth, createBooking);

export default router;