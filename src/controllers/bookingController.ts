// src/controllers/bookingController.ts
import { Response } from "express";
import { db, firebaseAdmin as admin } from "../config/firebase";
import { AuthenticatedRequest } from "../middlewares/verifyAuth";
import { sendNotification } from "../services/notificationService";

// تحويل 12h → 24h
function convertTo24HourFormat(time12: string): string {
  const [time, modifier] = time12.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

export const createBooking = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      roomId,
      branchId,
      date,
      startTime,
      endTime,
      totalPrice,
      depositScreenshotUrl,
    } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roomId || !branchId || !date || !startTime || !endTime || !totalPrice) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const start24 = convertTo24HourFormat(startTime);
    const end24 = convertTo24HourFormat(endTime);

    const bookingRef = await db.collection("bookings").add({
      userId: req.user.uid,
      roomId,
      branchId,
      date,
      startTime: start24,
      endTime: end24,
      totalPrice,
      depositScreenshotUrl: depositScreenshotUrl ?? null,
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await sendNotification(
      req.user.uid,
      "booking_created",
      "Your booking is awaiting admin approval"
    );

    return res.status(201).json({
      message: "Booking created successfully",
      bookingId: bookingRef.id,
    });
  } catch (error: any) {
    console.error("Create booking error:", error);
    return res.status(500).json({ message: error.message });
  }
};