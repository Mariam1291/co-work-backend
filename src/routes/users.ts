// src/routes/users.ts
import { Router } from "express";
import { db } from "../config/firebase";
import admin from "../config/firebase"; 
import { verifyAuth } from "../middlewares/verifyAuth"; 
import { isAdmin } from "../middlewares/isAdmin";

const router = Router();

// Get All Users (Admin Only)
router.get("/", verifyAuth, isAdmin, async (req, res) => {
  try {
    const usersSnap = await db.collection("users").get();
    const users = usersSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(users);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "فشل جلب المستخدمين" });
  }
});

// Get Single User By ID
router.get("/:id", verifyAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    const authUser = (req as any).user;

    const userRecord = await admin.auth().getUser(authUser.uid);
    if (authUser.uid !== userId && userRecord.customClaims?.admin !== true) {
      return res.status(403).json({ message: "ممنوع: لا تملك صلاحية لرؤية بيانات مستخدم آخر" });
    }

    const userSnap = await db.collection("users").doc(userId).get();
    if (!userSnap.exists) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    res.status(200).json({ id: userSnap.id, ...userSnap.data() });
  } catch (error: any) {
    console.error("Error getting user:", error);
    res.status(500).json({ message: "فشل جلب بيانات المستخدم" });
  }
});

// Update User
router.put("/:id", verifyAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    const authUser = (req as any).user;

    const userRecord = await admin.auth().getUser(authUser.uid);
    if (authUser.uid !== userId && userRecord.customClaims?.admin !== true) {
      return res.status(403).json({ message: "ممنوع: لا تملك صلاحية تعديل بيانات مستخدم آخر" });
    }

    await db.collection("users").doc(userId).update(req.body);
    res.json({ message: "تم تحديث البيانات بنجاح" });
  } catch (error: any) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "فشل تحديث البيانات" });
  }
});

// Delete User (Admin Only)
router.delete("/:id", verifyAuth, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    await db.collection("users").doc(userId).delete();
    await admin.auth().deleteUser(userId);

    res.json({ message: "تم حذف المستخدم نهائيًا" });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "فشل حذف المستخدم" });
  }
});

export default router; // تأكد من تصديره هكذا
