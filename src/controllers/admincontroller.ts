// src/controllers/admincontroller.ts
import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { firebaseAdmin as admin } from "../config/firebase";
// تصدير دوال إدارة الأدمن
export const setAdmin = async (req: Request, res: Response) => {
  try {
    const { uid } = req.body;

    if (!uid || typeof uid !== 'string' || uid.trim() === '') {
      return res.status(400).json({ message: 'uid is required and must be a valid string' });
    }

    const trimmedUid = uid.trim();

    // التأكد من وجود المستخدم في Firebase Authentication
    const userRecord = await admin.auth().getUser(trimmedUid);

    const userRef = db.collection('users').doc(trimmedUid);

    // تعيين أو تحديث الـ user في Firestore
    await userRef.set(
      {
        user_type: 'admin',
        email: userRecord.email || null,
        phoneNumber: userRecord.phoneNumber || null,
        displayName: userRecord.displayName || null,
        photoURL: userRecord.photoURL || null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        isAdmin: true, // تعيين isAdmin في Firestore
      },
      { merge: true }
    );

    // تعيين Custom Claims في Firebase Auth
    await admin.auth().setCustomUserClaims(trimmedUid, {
      admin: true,
    });

    return res.status(200).json({
      message: 'Admin privileges granted successfully',
      uid: trimmedUid,
      email: userRecord.email || 'N/A',
      customClaimsSet: true,
      firestoreUpdated: true,
    });

  } catch (err: any) {
    console.error('Error setting admin:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// جلب الحجوزات المعلقة
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
        depositScreenshotUrl: data.depositScreenshotUrl,
        createdAt: data.createdAt?.toDate?.() || null,
      };
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching pending bookings:", error);
    res.status(500).json({ message: "فشل جلب الحجوزات" });
  }
};

// الموافقة على الحجز
export const approveBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.collection("bookings").doc(id).update({
      status: "confirmed",
      confirmedAt: admin.firestore.FieldValue.serverTimestamp(),
      confirmedBy: (req as any).user.uid,
    });

    res.json({ message: "تم تأكيد الحجز بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "فشل تأكيد الحجز" });
  }
};

// رفض الحجز
export const rejectBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    await db.collection("bookings").doc(id).update({
      status: "rejected",
      rejectionReason: reason || "لا يوجد سبب محدد",
      rejectedAt: admin.firestore.FieldValue.serverTimestamp(),
      rejectedBy: (req as any).user.uid,
    });

    res.json({ message: "تم رفض الحجز" });
  } catch (error) {
    res.status(500).json({ message: "فشل رفض الحجز" });
  }
};
