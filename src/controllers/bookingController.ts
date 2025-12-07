import { Request, Response } from "express";
import { db } from "../config/firebase";  // تأكد من استيراد db من firebase
import { BookingService } from "../services/bookingservice"; // استيراد خدمة الحجز
import { firebaseAdmin as admin } from "../config/firebase";  // استيراد admin بشكل صحيح
import { AuthenticatedRequest } from "../middlewares/verifyAuth";  // استيراد AuthenticatedRequest

// تحويل الوقت إلى تنسيق 24 ساعة
function convertTo24HourFormat(time12: string): string {
  const [time, modifier] = time12.split(' ');
  let [hours, minutes] = time.split(':').map(num => parseInt(num, 10));

  if (modifier === 'PM' && hours !== 12) {
    hours += 12;  // تحويل إلى مساء
  } else if (modifier === 'AM' && hours === 12) {
    hours = 0;    // تحويل إلى منتصف الليل
  }

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// دالة لإنشاء حجز
export const createBooking = async (req: AuthenticatedRequest, res: Response) => {  // استخدام AuthenticatedRequest هنا
  try {
    const { roomId, branchId, date, startTime, endTime, totalPrice, depositScreenshot } = req.body;

    // تحقق من توافر الوقت
    const isAvailable = await BookingService.isTimeSlotAvailable(roomId, date, startTime, endTime);
    if (!isAvailable) {
      return res.status(409).json({ message: "هذا الوقت محجوز بالفعل" });
    }

    // رفع صورة الإيداع إذا كانت موجودة
    let screenshotUrl: string | null = null;
    if (depositScreenshot) {
      screenshotUrl = await BookingService.uploadDepositScreenshot(depositScreenshot, req.user.uid);
    }

    // تحويل الوقت إلى 24 ساعة
    const startTime24 = convertTo24HourFormat(startTime);
    const endTime24 = convertTo24HourFormat(endTime);

    // إضافة الحجز إلى قاعدة البيانات
    const bookingRef = await db.collection("bookings").add({
      userId: req.user.uid, // يجب أن تكون `user` جزء من `AuthenticatedRequest`
      branchId,
      roomId,
      date,
      startTime: startTime24, // وقت البداية بتنسيق 24 ساعة
      endTime: endTime24,     // وقت النهاية بتنسيق 24 ساعة
      totalPrice,
      depositScreenshotUrl: screenshotUrl,  // حفظ الرابط في Firestore
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(201).json({
      message: "تم إنشاء الحجز بنجاح، في انتظار موافقة الأدمن",
      bookingId: bookingRef.id,
    });

  } catch (error) {
    console.error("خطأ في إنشاء الحجز:", error);
    return res.status(500).json({ message: error.message || "حدث خطأ غير متوقع" });
  }
};
