// src/controllers/bookingController.ts
import { Response } from "express";
import { db } from "../config/firebase";
import { AuthenticatedRequest } from "../middlewares/verifyAuth";

function convertTo24HourFormat(time12: string): string {
  const [time, modifier] = time12.split(" ");
  let [hours, minutes] = time.includes(":")
    ? time.split(":").map(Number)
    : [Number(time), 0];

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
      depositScreenshotUrl, // ✅ جاي من الفرونت
    } = req.body;

    if (
      !roomId ||
      !branchId ||
      !date ||
      !startTime ||
      !endTime ||
      !totalPrice ||
      !depositScreenshotUrl
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
      depositScreenshotUrl, // ✅ URL فقط (Cloudinary)
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const ref = await db.collection("bookings").add(booking);

    return res.status(201).json({
      bookingId: ref.id,
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};