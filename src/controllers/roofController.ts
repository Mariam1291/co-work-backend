// src/controllers/roofController.ts
import { Request, Response } from "express";
import { db } from "../config/firebase";

// GET all roofs
export const getAllRoof = async (req: Request, res: Response) => {
  try {
    const snap = await db.collection("roof").get();
    const roof = snap.docs.map(doc => ({
      id: doc.id,  // إضافة الـ ID
      name: doc.data().name,
      description: doc.data().description,
      isActive: doc.data().is_active,
      numOfChairs: doc.data().num_of_chair,
      pricePerHour: doc.data().price_per_hour,
      images: doc.data().images || [],  // إضافة الصور
    }));

    res.status(200).json(roof); // إرجاع قائمة الأسطح
  } catch (error) {
    console.error("Error fetching roof:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET single roof by ID
export const getRoofById = async (req: Request, res: Response) => {
  try {
    const roofId = req.params.roofId; // الحصول على الـ roofId من الـ request params
    const doc = await db.collection("roof").doc(roofId).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Roof not found" });
    }

    res.status(200).json({
      id: doc.id, // إرجاع الـ ID
      ...doc.data(), // إرجاع بيانات السطح
    });
  } catch (error) {
    console.error("Error fetching roof:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET roof of a specific branch
export const getRoofByBranch = async (req: Request, res: Response) => {
  try {
    const branchId = req.params.branchId; // الحصول على الـ branchId من الـ request params
    const branchDoc = await db.collection("branches").doc(branchId).get();

    if (!branchDoc.exists) {
      return res.status(404).json({ message: "Branch not found" });
    }

    const branchRoof: string[] = branchDoc.data()?.roof || []; // جلب أسطح الفرع

    const roofPromises = branchRoof.map((id) =>
      db.collection("roof").doc(id).get()
    );

    const roofDocs = await Promise.all(roofPromises);

    const roof = roofDocs
      .filter((doc) => doc.exists)
      .map((doc) => ({
        id: doc.id,  // إضافة الـ ID
        ...doc.data(),  // إرجاع بيانات السطح
      }));

    res.status(200).json(roof); // إرجاع الأسطح الخاصة بالفرع
  } catch (error) {
    console.error("Error fetching branch roof:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
