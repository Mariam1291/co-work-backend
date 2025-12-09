import { Request, Response } from "express";
import admin from "../config/firebase";

const db = admin.firestore();

// جلب كل الفروع
export const getBranches = async (req: Request, res: Response) => {
  try {
    const branchesSnap = await db.collection("branches").get();
    const branches = branchesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(branches); // إرجاع الفروع
  } catch (error) {
    console.error("Error fetching branches:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// جلب فرع واحد حسب الـ ID
export const getBranchById = async (req: Request, res: Response) => {
  try {
    const branchId = req.params.id;

    const branchRef = db.collection("branches").doc(branchId);
    const branchDoc = await branchRef.get();

    if (!branchDoc.exists) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.status(200).json({ id: branchDoc.id, ...branchDoc.data() }); // إرجاع البيانات
  } catch (error) {
    console.error("Error fetching branch:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
