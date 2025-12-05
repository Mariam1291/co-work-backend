// src/controllers/booking.controller.ts
import { Request, Response } from "express";
import { db } from "../config/firebase";
import admin from "../config/firebase";
import { CreateBookingSchema } from "../models/booking.model";
import { BookingService } from "../services/booking.service";

// نعيد تعريف الـ user بشكل نظيف وآمن بدون صدام مع أي types تانية
export interface AuthenticatedRequest extends Request {
  user: {
    uid: string;
    email?: string | null;
  };
}

export const createBooking = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // الـ user مضمون إنه موجود بفضل الـ middleware
    const user = req.user;

    const validation = CreateBookingSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "بيانات الحجز غير صحيحة",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { roomId, branchId, date, startTime, endTime, totalPrice, depositScreenshot } = validation.data;

    // تحقق من توافر الوقت
    const isAvailable = await BookingService.isTimeSlotAvailable(roomId, date, startTime, endTime);
    if (!isAvailable) {
      return res.status(409).json({ message: "هذا الوقت محجوز بالفعل" });
    }

    // رفع صورة الإيداع
    let screenshotUrl: string | null = null;
    if (depositScreenshot) {
      screenshotUrl = await BookingService.uploadDepositScreenshot(depositScreenshot, user.uid);
    }

    // جلب بيانات الفرع والغرفة
    const [roomSnap, branchSnap] = await Promise.all([
      db.collection("rooms").doc(roomId).get(),
      db.collection("branches").doc(branchId).get(),
    ]);

    if (!roomSnap.exists || !branchSnap.exists) {
      return res.status(404).json({ message: "الغرفة أو الفرع غير موجود" });
    }

    const room = roomSnap.data()!;
    const branch = branchSnap.data()!;

    // إنشاء الحجز
    const bookingRef = await db.collection("bookings").add({
      userId: user.uid,
      userEmail: user.email || "unknown@email.com",
      branchId,
      branchName: branch.name || "فرع شغف",
      roomId,
      roomName: room.name || "غرفة",
      date,
      startTime,
      endTime,
      totalPrice,
      depositScreenshotUrl: screenshotUrl,
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(201).json({
      message: "تم إنشاء الحجز بنجاح، في انتظار موافقة الأدمن",
      bookingId: bookingRef.id,
    });

  } catch (error: any) {
    console.error("خطأ في إنشاء الحجز:", error);
    return res.status(500).json({ message: error.message || "حدث خطأ غير متوقع" });
  }
};
// في booking.controller.ts أضيفي الدالة دي
export const getAvailableTimes = async (req: Request, res: Response) => {
  try {
    const { roomId, date } = req.query;
    if (!roomId || !date) return res.status(400).json({ message: "roomId and date required" });

    const snapshot = await db
      .collection("bookings")
      .where("roomId", "==", roomId)
      .where("date", "==", date)
      .where("status", "in", ["pending", "confirmed"])
      .get();

    const bookedSlots: { start: string; end: string }[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      bookedSlots.push({ start: data.startTime, end: data.endTime });
    });

    res.json({ bookedSlots });
  } catch (error) {
    res.status(500).json({ message: "فشل جلب الأوقات" });
  }
};