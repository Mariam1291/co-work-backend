// controllers/admin.controller.ts
import { Request, Response } from 'express';
import admin from '../config/firebase';

const db = admin.firestore();

export const setAdmin = async (req: Request, res: Response) => {
  try {
    const { uid } = req.body;

    // 1. التأكد إن الـ uid موجود في الطلب
    if (!uid || typeof uid !== 'string' || uid.trim() === '') {
      return res.status(400).json({ message: 'uid is required and must be a valid string' });
    }

    const trimmedUid = uid.trim();

    // 2. التأكد إن اليوزر موجود فعلاً في Firebase Authentication
    const userRecord = await admin.auth().getUser(trimmedUid);
    console.log('تم العثور على المستخدم في Auth:', userRecord.email || userRecord.phoneNumber || trimmedUid);

    // 3. تعيين أو تحديث الـ user في Firestore (حتى لو ماكنش موجود قبل كده)
    const userRef = db.collection('users').doc(trimmedUid);

    await userRef.set(
      {
        user_type: 'admin',
        email: userRecord.email || null,
        phoneNumber: userRecord.phoneNumber || null,
        displayName: userRecord.displayName || null,
        photoURL: userRecord.photoURL || null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        isAdmin: true, // اختياري لو بتستخدمه في الفرونت
      },
      { merge: true } // مهم جدًا: لو الدوكيومنت موجود → يعدل، لو مش موجود → يعمل create
    );

    // 4. (اختياري لكن موصى بيه جدًا) تعيين Custom Claim عشان تحمي الـ routes من السيرفر
    await admin.auth().setCustomUserClaims(trimmedUid, {
      admin: true,
    });

    console.log(`تم تحويل المستخدم ${userRecord.email || trimmedUid} إلى أدمن بنجاح ✅`);

    return res.status(200).json({
      message: 'Admin privileges granted successfully',
      uid: trimmedUid,
      email: userRecord.email || 'N/A',
      customClaimsSet: true,
      firestoreUpdated: true,
    });

  } catch (err: any) {
    console.error('خطأ في تعيين الأدمن:', err);

    // رسائل واضحة حسب نوع الخطأ
    if (err.code === 'auth/user-not-found') {
      return res.status(404).json({ message: 'User not found in Firebase Authentication' });
    }

    if (err.code === 'auth/invalid-uid') {
      return res.status(400).json({ message: 'Invalid UID format' });
    }

    return res.status(500).json({
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

// 1️⃣ جلب كل الحجوزات الـ pending مع كل البيانات + صورة الإيداع من Cloudinary
export const getPendingBookings = async (req: Request, res: Response) => {
  try {
    const snapshot = await db
      .collection("bookings")
      .where("status", "==", "pending")
      .orderBy("createdAt", "desc")
      .get();

    const bookings = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        userEmail: data.userEmail,
        branchName: data.branchName,
        roomName: data.roomName,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        totalPrice: data.totalPrice,
        depositScreenshotUrl: data.depositScreenshotUrl, // رابط Cloudinary
        createdAt: data.createdAt?.toDate?.() || null,
      };
    });

    res.status(200).json(bookings);
  } catch (error: any) {
    console.error("Error fetching pending bookings:", error);
    res.status(500).json({ message: "فشل جلب الحجوزات" });
  }
};

// 2️⃣ موافقة على الحجز
export const approveBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.collection("bookings").doc(id).update({
      status: "confirmed",
      confirmedAt: admin.firestore.FieldValue.serverTimestamp(),
      confirmedBy: (req as any).user.uid,
    });

    res.json({ message: "تم تأكيد الحجز بنجاح" });
  } catch (error: any) {
    res.status(500).json({ message: "فشل تأكيد الحجز" });
  }
};

// 3️⃣ رفض الحجز
export const rejectBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body; // اختياري

    await db.collection("bookings").doc(id).update({
      status: "rejected",
      rejectionReason: reason || "لا يوجد سبب محدد",
      rejectedAt: admin.firestore.FieldValue.serverTimestamp(),
      rejectedBy: (req as any).user.uid,
    });

    res.json({ message: "تم رفض الحجز" });
  } catch (error: any) {
    res.status(500).json({ message: "فشل رفض الحجز" });
  }
};