// src/routes/rooms.ts
import { Router } from "express";
import admin from "../config/firebase";

const router = Router();
const db = admin.firestore();

// 1) ADD ROOM
router.post("/add", async (req, res) => {
  try {
    const { id, branch_id, num_of_chair, price_per_hour, is_active } = req.body;

    if (!id || !branch_id)
      return res.status(400).json({ message: "id & branch_id are required" });

    const roomData = {
      id,
      branch_id,
      num_of_chair,
      price_per_hour,
      is_active: is_active ?? true,
    };

    await db.collection("rooms").doc(id).set(roomData);

    return res.status(201).json({ message: "Room added", room: roomData });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

// 2) GET ALL ROOMS OF A BRANCH
router.get("/branch/:branch_id", async (req, res) => {
  try {
    const branch_id = req.params.branch_id;

    const snap = await db
      .collection("rooms")
      .where("branch_id", "==", branch_id)
      .get();

    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

// 3) GET SINGLE ROOM
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const doc = await db.collection("rooms").doc(id).get();

    if (!doc.exists)
      return res.status(404).json({ message: "Room not found" });

    return res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

// 4) UPDATE ROOM
router.patch("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    const ref = db.collection("rooms").doc(id);
    const snap = await ref.get();

    if (!snap.exists)
      return res.status(404).json({ message: "Room not found" });

    await ref.update(updates);

    return res.status(200).json({ message: "Room updated" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

// 5) DELETE ROOM
router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await db.collection("rooms").doc(id).delete();

    return res.status(200).json({ message: "Room deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
