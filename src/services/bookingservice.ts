import { db } from "../config/firebase";

export class BookingService {
  /**
   * يتحقق مما إذا كان الوقت المطلوب للحجز متاحًا أم لا.
   * @param roomId - معرف الغرفة
   * @param date - تاريخ الحجز (YYYY-MM-DD)
   * @param startTime - وقت البدء بتنسيق 24 ساعة (HH:mm)
   * @param endTime - وقت الانتهاء بتنسيق 24 ساعة (HH:mm)
   */
  static async isTimeSlotAvailable(
    roomId: string,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<boolean> {
    const snapshot = await db
      .collection("bookings")
      .where("roomId", "==", roomId)
      .where("date", "==", date)
      .where("status", "in", ["pending", "confirmed"])
      .get();

    if (snapshot.empty) {
      return true;
    }

    for (const doc of snapshot.docs) {
      const booking = doc.data();

      // تحقق من التداخل الزمني
      if (startTime < booking.endTime && endTime > booking.startTime) {
        return false;
      }
    }

    return true;
  }
}