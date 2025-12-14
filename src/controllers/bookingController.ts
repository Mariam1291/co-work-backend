import { Response } from "express";
import { db, firebaseAdmin as admin } from "../config/firebase";
import { BookingService } from "../services/bookingservice"; // اسم موحد
import { AuthenticatedRequest } from "../middlewares/verifyAuth";
import { sendNotification } from "../services/notificationService";

// دالة مساعدة لتحويل الوقت من نظام 12 ساعة إلى 24 ساعة
function convertTo24HourFormat(time12: string): string {
  const [time, modifier] = time12.split(' ');
  let [hours, minutes] = time.split(':').map(num => parseInt(num, 10));

  if (modifier.toUpperCase() === 'PM' && hours !== 12) {
    hours += 12;
  } else if (modifier.toUpperCase() === 'AM' && hours === 12) {
    hours = 0; // منتصف الليل
  }

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export const createBooking = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // 1. استخراج البيانات من جسم الطلب
    const { roomId, branchId, date, startTime, endTime, totalPrice, depositScreenshot } = req.body;
    const userId = req.user?.uid; // استخراج userId من التوكن

    // 2. التحقق من وجود البيانات الأساسية
    if (!userId || !roomId || !date || !startTime || !endTime || !totalPrice || !depositScreenshot) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // 3. تحويل الأوقات إلى تنسيق 24 ساعة للمقارنة والتخزين
    const startTime24 = convertTo24HourFormat(startTime);
    const endTime24 = convertTo24HourFormat(endTime);

    // 4. التحقق من أن الوقت متاح
    const isAvailable = await BookingService.isTimeSlotAvailable(roomId, date, startTime24, endTime24);
    if (!isAvailable) {
      return res.status(409).json({ message: "This time slot is already booked." });
    }

    // 5. رفع صورة إثبات الدفع
    const screenshotUrl = await BookingService.uploadDepositScreenshot(depositScreenshot, userId);

    // 6. إضافة الحجز إلى قاعدة البيانات (Firestore)
    const bookingRef = await db.collection("bookings").add({
      userId: userId,
      branchId,
      roomId,
      date,
      startTime: startTime24, // تخزين بتنسيق 24 ساعة
      endTime: endTime24,     // تخزين بتنسيق 24 ساعة
      totalPrice,
      depositScreenshotUrl: screenshotUrl, // رابط الصورة بعد الرفع
      status: "pending", // الحالة الأولية للحجز
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 7. (اختياري) إرسال إشعار للمستخدم
    // await sendNotification(userId, "booking_created", "Your booking is awaiting admin approval.");

    // 8. إرسال استجابة ناجحة
    res.status(201).json({
      message: "Booking created successfully, awaiting admin approval.",
      bookingId: bookingRef.id,
    });

  } catch (error: any) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: error.message || "An unexpected error occurred." });
  }
};
