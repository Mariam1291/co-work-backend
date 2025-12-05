// src/services/booking.service.ts
import { db, storage } from "../config/firebase";
import admin from "firebase-admin";

export class BookingService {
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

    for (const doc of snapshot.docs) {
      const booking = doc.data();
      if (startTime < booking.endTime && endTime > booking.startTime) {
        return false;
      }
    }
    return true;
  }

  static async uploadDepositScreenshot(base64: string, uid: string): Promise<string> {
    const bucket = storage.bucket();
    const filename = `deposits/${uid}/${Date.now()}.png`;
    const file = bucket.file(filename);

    const buffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), "base64");

    await file.save(buffer, {
      metadata: { contentType: "image/png" },
    });

    await file.makePublic();
    return `https://storage.googleapis.com/${bucket.name}/${filename}`;
  }
}