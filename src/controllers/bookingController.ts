// src/controllers/bookingController.ts
import { Request, Response } from "express";
import { db } from "../config/firebase";
import { BookingService } from "../services/bookingservice";
import { firebaseAdmin as admin } from "../config/firebase";
import { AuthenticatedRequest } from "../middlewares/verifyAuth";
import { sendNotification } from "../services/notificationService";

// Convert 12-hour time to 24-hour time
function convertTo24HourFormat(time12: string): string {
  const [time, modifier] = time12.split(' ');
  let [hours, minutes] = time.split(':').map(num => parseInt(num, 10));

  if (modifier === 'PM' && hours !== 12) {
    hours += 12;  // Convert PM times
  } else if (modifier === 'AM' && hours === 12) {
    hours = 0;    // Convert midnight
  }

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Create booking
export const createBooking = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { roomId, branchId, date, startTime, endTime, totalPrice, depositScreenshot } = req.body;

    // Check if the time slot is available
    const isAvailable = await BookingService.isTimeSlotAvailable(roomId, date, startTime, endTime);
    if (!isAvailable) {
      return res.status(409).json({ message: "This time slot is already booked" });
    }

    // Upload the deposit screenshot if provided
    
    const { depositScreenshotUrl } = req.body;
      let screenshotUrl: string | null = null;
      if (depositScreenshotUrl) {
        screenshotUrl = depositScreenshotUrl;
      }

    // Convert times to 24-hour format
    const startTime24 = convertTo24HourFormat(startTime);
    const endTime24 = convertTo24HourFormat(endTime);

    // Add the booking to Firestore
    const bookingRef = await db.collection("bookings").add({
      userId: req.user.uid,
      branchId,
      roomId,
      date,
      startTime: startTime24, 
      endTime: endTime24,     
      totalPrice,
      depositScreenshotUrl: screenshotUrl,
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Send a notification to the user
    await sendNotification(req.user.uid, "booking_created", "Your booking is awaiting admin approval");

    res.status(201).json({
      message: "Booking created successfully, awaiting admin approval",
      bookingId: bookingRef.id,
    });

  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({ message: error.message || "Unexpected error occurred" });
  }
};
