// src/controllers/bookingController.ts
import { Request, Response } from "express";
import { db } from "../config/firebase";
import { BookingService } from "../services/bookingservice"; // تأكد من صحة خدمة الحجز
import { firebaseAdmin as admin } from "../config/firebase";  // تأكد من استيراد admin بشكل صحيح
import { AuthenticatedRequest } from "../middlewares/verifyAuth";  // استيراد AuthenticatedRequest
import { sendNotification } from "../services/notificationService"; // استيراد دالة sendNotification

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
export const createBooking = async (req: AuthenticatedRequest, res: Response) => {
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

    // إرسال إشعار للمستخدم بعد إنشاء الحجز
    await sendNotification(req.user.uid, "booking_created", "حجزك في انتظار الموافقة");

    return res.status(201).json({
      message: "تم إنشاء الحجز بنجاح، في انتظار موافقة الأدمن",
      bookingId: bookingRef.id,
    });

  } catch (error) {
    console.error("خطأ في إنشاء الحجز:", error);
    return res.status(500).json({ message: error.message || "حدث خطأ غير متوقع" });
  }
};

// دالة لحذف الحجز
export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id;
    const bookingDoc = await db.collection("bookings").doc(bookingId).get();

    if (!bookingDoc.exists) {
      return res.status(404).json({ message: "الحجز غير موجود" });
    }

    await db.collection("bookings").doc(bookingId).delete();

    // إرسال إشعار للمستخدم بعد حذف الحجز
    const userId = bookingDoc.data()?.userId;  // جلب ID المستخدم من الحجز
    if (userId) {
      await sendNotification(userId, "booking_deleted", "تم حذف حجزك");
    }

    res.status(200).json({ message: "تم حذف الحجز بنجاح" });
  } catch (error) {
    console.error("خطأ في حذف الحجز:", error);
    res.status(500).json({ message: "حدث خطأ أثناء حذف الحجز" });
  }
};

// دالة لتحديث حالة الحجز (مثال: الموافقة على الحجز)
export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;  // يجب إرسال الحالة (approved, rejected, etc.)

    const bookingDoc = await db.collection("bookings").doc(bookingId).get();

    if (!bookingDoc.exists) {
      return res.status(404).json({ message: "الحجز غير موجود" });
    }

    // تحديث حالة الحجز في Firestore
    await db.collection("bookings").doc(bookingId).update({ status });

    // إرسال إشعار للمستخدم بعد تغيير حالة الحجز
    const userId = bookingDoc.data()?.userId;  // جلب ID المستخدم من الحجز
    if (userId) {
      await sendNotification(userId, "booking_status_updated", `تم تحديث حالة حجزك إلى ${status}`);
    }

    res.status(200).json({ message: "تم تحديث حالة الحجز بنجاح" });
  } catch (error) {
    console.error("خطأ في تحديث حالة الحجز:", error);
    res.status(500).json({ message: "حدث خطأ أثناء تحديث حالة الحجز" });
  }
};
export const checkRoomAvailability = async (req: Request, res: Response) => {
  try {
    const { roomId, date, startTime, endTime } = req.body;

    // تحويل الوقت إلى 24 ساعة
    const startTime24 = convertTo24HourFormat(startTime);
    const endTime24 = convertTo24HourFormat(endTime);

    // تحقق من التوافر
    const isAvailable = await BookingService.isTimeSlotAvailable(roomId, date, startTime, endTime);
    if (isAvailable) {
      return res.status(200).json({ message: "الغرفة متاحة", isAvailable: true });
    } else {
      return res.status(409).json({ message: "الغرفة غير متاحة في هذا الوقت", isAvailable: false });
    }

  } catch (error) {
    console.error("Error checking room availability:", error);
    res.status(500).json({ message: "حدث خطأ أثناء التحقق من التوافر" });
  }
};