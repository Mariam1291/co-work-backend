import { Request, Response } from "express";
import admin from "../config/firebase";

const db = admin.firestore();

// جلب كل الفروع
export const getBranches = async (req: Request, res: Response) => {
  try {
    const branchesSnap = await db.collection("branches").get();
    const branches = branchesSnap.docs.map(doc => ({
      id: doc.id,
      nameAr: doc.data().nameAr,
      nameEn: doc.data().nameEn,
      addressAr: doc.data().addressAr,
      addressEn: doc.data().addressEn,
      cityAr: doc.data().cityAr,
      cityEn: doc.data().cityEn,
      games: doc.data().games,
      images: doc.data().images,
      isActive: doc.data().isActive,
      roof: doc.data().roof,
      rooms: doc.data().rooms,
      phoneNumber: doc.data().phoneNumber,
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

    const branchData = branchDoc.data();
    res.status(200).json({
      id: branchDoc.id,
      nameAr: branchData?.nameAr,
      nameEn: branchData?.nameEn,
      addressAr: branchData?.addressAr,
      addressEn: branchData?.addressEn,
      cityAr: branchData?.cityAr,
      cityEn: branchData?.cityEn,
      games: branchData?.games,
      images: branchData?.images,
      isActive: branchData?.isActive,
      roof: branchData?.roof,
      rooms: branchData?.rooms,
      phoneNumber: branchData?.phoneNumber,
    });
  } catch (error) {
    console.error("Error fetching branch:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
