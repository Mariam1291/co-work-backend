import { Request, Response } from "express";
import { db } from "../config/firebase";

// GET all rooms
export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const snap = await db.collection("rooms").get();
    const rooms = snap.docs.map(doc => ({
      id: doc.id,  // إضافة الـ ID
      nameAr: doc.data()["name-ar"],  // الاسم بالعربي
      nameEn: doc.data()["name-en"],  // الاسم بالإنجليزي
      pricePerHour: doc.data().price_per_hour,  // السعر بالساعة
      isActive: doc.data().is_active,  // حالة الغرفة
      placeId: doc.data().place_id,  // رقم المكان
      capacity: doc.data().capacity,  // السعة
      images: doc.data().images || [],  // إضافة صور الغرفة (إذا كانت موجودة)
    }));

    res.status(200).json(rooms); // إرجاع قائمة الغرف
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET single room by ID
export const getRoomById = async (req: Request, res: Response) => {
  try {
    const roomId = req.params.roomId;  // الحصول على الـ ID من الـ request params
    const doc = await db.collection("rooms").doc(roomId).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({
      id: doc.id,  // إرجاع الـ ID
      ...doc.data(),  // إرجاع بيانات الغرفة
    });
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET rooms of a branch
export const getRoomsByBranch = async (req: Request, res: Response) => {
  try {
    const branchId = req.params.branchId;  // الحصول على الـ branchId من الـ request params
    const branchDoc = await db.collection("branches").doc(branchId).get();

    if (!branchDoc.exists) {
      return res.status(404).json({ message: "Branch not found" });
    }

    const branchRooms: string[] = branchDoc.data()?.rooms || [];

    const roomPromises = branchRooms.map((id) =>
      db.collection("rooms").doc(id).get()
    );

    const roomDocs = await Promise.all(roomPromises);

    const rooms = roomDocs
      .filter((doc) => doc.exists)
      .map((doc) => ({
        id: doc.id,  // إضافة الـ ID
        ...doc.data(),  // إرجاع بيانات الغرفة
      }));

    res.status(200).json(rooms); // إرجاع الغرف الخاصة بالفرع
  } catch (error) {
    console.error("Error fetching branch rooms:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
