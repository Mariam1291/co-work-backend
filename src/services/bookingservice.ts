import { db, firebaseAdmin as admin } from "../config/firebase";

export class BookingService {
  /**
   * يتحقق مما إذا كان الوقت المطلوب للحجز متاحًا أم لا.
   * @param startTime - وقت البدء بتنسيق 24 ساعة (HH:mm)
   * @param endTime - وقت الانتهاء بتنسيق 24 ساعة (HH:mm)
   */
  static async isTimeSlotAvailable(
    roomId: string,
    date: string,
    startTime: string, // يجب أن يكون بتنسيق 24 ساعة
    endTime: string   // يجب أن يكون بتنسيق 24 ساعة
  ): Promise<boolean> {
    const bookingsRef = db.collection("bookings");
    const snapshot = await bookingsRef
      .where("roomId", "==", roomId)
      .where("date", "==", date)
      .where("status", "in", ["pending", "confirmed"]) // التحقق من الحجوزات المعلقة والمؤكدة
      .get();

    if (snapshot.empty) {
      return true; // لا توجد حجوزات في هذا اليوم لهذه الغرفة
    }

    // التحقق من عدم وجود تداخل في الأوقات
    for (const doc of snapshot.docs) {
      const booking = doc.data();
      // الشرط يعني: هل وقت البدء الجديد قبل نهاية الحجز القديم، وهل وقت النهاية الجديد بعد بداية الحجز القديم؟
      if (startTime < booking.endTime && endTime > booking.startTime) {
        return false; // تداخل موجود، الوقت غير متاح
      }
    }

    return true; // لا يوجد تداخل، الوقت متاح
  }

  /**
   * يرفع صورة إثبات الدفع (Base64) إلى Firebase Storage.
   * @param base64 - الصورة بصيغة Base64.
   * @param userId - معرف المستخدم لإنشاء مجلد خاص به.
   * @returns رابط الصورة العام بعد الرفع.
   */
  static async uploadDepositScreenshot(base64: string, userId: string): Promise<string> {
    const bucket = admin.storage().bucket();
    const filename = `deposits/${userId}/${Date.now()}.png`;
    const file = bucket.file(filename);

    // إزالة الجزء الأول من نص Base64 (e.g., "data:image/png;base64,")
    const buffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), "base64");

    await file.save(buffer, {
      metadata: { contentType: "image/png" },
      public: true, // جعل الملف عامًا مباشرة
    });

    // إرجاع الرابط العام القابل للوصول
    return `https://storage.googleapis.com/${bucket.name}/${filename}`;
  }
}
