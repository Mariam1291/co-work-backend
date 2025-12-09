// src/routes/games.ts
import { Router } from "express";
import { db } from "../config/firebase"; // تأكد من استيراد db من Firebase

const router = Router();

// نقطة النهاية لعرض الألعاب
router.get("/all", async (req, res) => {
  try {
    const gamesSnapshot = await db.collection("games").get();
    const games = gamesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.id,
        nameAr: data["name-ar"],
        nameEn: data["name-en"],
        descriptionAr: data["description-ar"],
        descriptionEn: data["description-en"],
        image: data.image,
        isActive: data.is_active,
      };
    });

    res.json(games);
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({ message: "حدث خطأ في جلب الألعاب" });
  }
});

export default router; // تأكد من تصديره هكذا
