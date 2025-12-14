import { Response } from "express";
import { db } from "../config/firebase";
import { AuthenticatedRequest } from "../middlewares/verifyAuth";

/**
 * تحويل الوقت من 12-hour إلى 24-hour
 * مثال: "10 AM" → "10:00"
 * مثال: "3:30 PM" → "15:30"
 */
function convertTo24HourFormat(time12: string): string {
  const [time, modifier] = time12.split(" ");

  let hours = 0;
  let minutes = 0;

  if (time.includes(":")) {
    const [h, m] = time.split(":");
    hours = parseInt(h, 10);
    minutes = parseInt(m, 10);
  } else {
    hours = parseInt(time, 10);
    minutes = 0;
  }

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

export const createBooking = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const {
      roomId,
      branchId,
      date,
      startTime,
      endTime,
      totalPrice,
      depositScreenshotUrl, // URL جاي من Cloudinary (اختياري)
    } = req.body;

    // ✅ Validation
    if (
      !roomId ||
      !branchId ||
      !date ||
      !startTime ||
      !endTime ||
      !totalPrice
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const booking = {
      userId: req.user.uid,
      roomId,
      branchId,
      date,
      startTime: convertTo24HourFormat(startTime),
      endTime: convertTo24HourFormat(endTime),
      totalPrice,
      depositScreenshotUrl: depositScreenshotUrl || null,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const ref = await db.collection("bookings").add(booking);

    return res.status(201).json({
      bookingId: ref.id,
      booking,
    });
  } catch (error) {
    console.error("❌ createBooking error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};