import { Request, Response } from "express";
import admin from "../config/firebase";

const db = admin.firestore();

// GET all rooms
export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const snap = await db.collection("rooms").get();
    const rooms = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET single room by ID
export const getRoomById = async (req: Request, res: Response) => {
  try {
    const roomId = req.params.roomId;
    const doc = await db.collection("rooms").doc(roomId).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET rooms of a branch
export const getRoomsByBranch = async (req: Request, res: Response) => {
  try {
    const branchId = req.params.branchId;
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
      .map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(rooms);
  } catch (error) {
    console.error("Error fetching branch rooms:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
