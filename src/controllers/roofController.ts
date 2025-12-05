import { Request, Response } from "express";
import admin from "../config/firebase";

const db = admin.firestore();

// GET all roof
export const getAllRoof = async (req: Request, res: Response) => {
  try {
    const snap = await db.collection("roof").get();
    const roof = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(roof);
  } catch (error) {
    console.error("Error fetching roof:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET single roof by ID
export const getRoofById = async (req: Request, res: Response) => {
  try {
    const roofId = req.params.roofId;

    const doc = await db.collection("roof").doc(roofId).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Roof not found" });
    }

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error fetching roof:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET roof of a specific branch
export const getRoofByBranch = async (req: Request, res: Response) => {
  try {
    const branchId = req.params.branchId;

    const branchDoc = await db.collection("branches").doc(branchId).get();

    if (!branchDoc.exists) {
      return res.status(404).json({ message: "Branch not found" });
    }

    const branchRoof: string[] = branchDoc.data()?.roof || [];

    const roofPromises = branchRoof.map(id =>
      db.collection("roof").doc(id).get()
    );

    const roofDocs = await Promise.all(roofPromises);

    const roof = roofDocs
      .filter(doc => doc.exists)
      .map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(roof);
  } catch (error) {
    console.error("Error fetching branch roof:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
