import { Request, Response } from "express";
import { db } from "../config/firebase";

// GET all events
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const snap = await db.collection("events").get();
    const events = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(events); // إرجاع قائمة كل الأحداث
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET event by ID
export const getEventById = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.eventId;
    const doc = await db.collection("events").doc(eventId).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({
      id: doc.id,
      ...doc.data(),
    }); // إرجاع الحدث بناءً على الـ ID
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET events of specific branch
export const getEventsByBranch = async (req: Request, res: Response) => {
  try {
    const branchId = req.params.branchId;
    const branchDoc = await db.collection("branches").doc(branchId).get();

    if (!branchDoc.exists) {
      return res.status(404).json({ message: "Branch not found" });
    }

    const branchEvents: string[] = branchDoc.data()?.events || []; // جلب أحداث الفرع

    if (branchEvents.length === 0) {
      return res.status(404).json({ message: "No events found for this branch" });
    }

    // جلب جميع الأحداث بناءً على الـ IDs الموجودة
    const eventsSnap = await Promise.all(
      branchEvents.map(async (id) => await db.collection("events").doc(id).get())
    );

    const events = eventsSnap
      .filter(doc => doc.exists) // التأكد من أن الحدث موجود
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

    res.status(200).json(events); // إرجاع الأحداث الخاصة بالفرع
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
