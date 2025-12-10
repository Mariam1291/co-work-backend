import { Request, Response } from "express";
import admin from "../config/firebase";

const db = admin.firestore();

// جلب كل الفروع
// GET branches
export const getAllBranches = async (req: Request, res: Response) => {
  try {
    const branchesSnap = await db.collection("branches").get();
    const branches = branchesSnap.docs.map((doc) => ({
      id: doc.id,
      branchName: doc.data().name || "No Name",  // تأكد من استخدام الحقل الصحيح
    }));
    res.status(200).json(branches);
  } catch (error) {
    console.error("Error fetching branches:", error);
    res.status(500).json({ message: "Error fetching branches" });
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
