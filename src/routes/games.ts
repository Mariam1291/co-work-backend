// src/routes/games.ts
import { Router } from "express";
import { db } from "../config/firebase";

const router = Router();

// جلب كل الألعاب
router.get("/all", async (req, res) => {
  console.log("📥 GET /api/games/all - Request received");
  try {
    const gamesSnapshot = await db.collection("games").get();
    console.log(`✅ Found ${gamesSnapshot.docs.length} games`);

    const games = gamesSnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        nameAr: data["name-ar"] || data.nameAr || data.name || "",
        nameEn: data["name-en"] || data.nameEn || data.name || "",
        descriptionAr: data["description-ar"] || data.descriptionAr || "",
        descriptionEn: data["description-en"] || data.descriptionEn || "",
        image: data.image || "",
        isActive: data.is_active ?? data.isActive ?? true,
      };
    });

    res.json(games);
  } catch (error: any) {
    console.error("❌ Error fetching all games:", error);
    res.status(500).json({ message: "حدث خطأ في جلب الألعاب", error: error.message });
  }
});

// جلب لعبة واحدة بالـ ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`📥 GET /api/games/${id} - Request received`);

  try {
    const gameDoc = await db.collection("games").doc(id).get();

    if (!gameDoc.exists) {
      console.log(`⚠️ Game with ID "${id}" not found`);
      return res.status(404).json({ message: "اللعبة غير موجودة" });
    }

    const data = gameDoc.data()!;
    console.log(`✅ Game "${id}" found`);

    const game = {
      id: gameDoc.id,
      nameAr: data["name-ar"] || data.nameAr || data.name || "",
      nameEn: data["name-en"] || data.nameEn || data.name || "",
      descriptionAr: data["description-ar"] || data.descriptionAr || "",
      descriptionEn: data["description-en"] || data.descriptionEn || "",
      image: data.image || "",
      isActive: data.is_active ?? data.isActive ?? true,
    };

    res.json(game);
  } catch (error: any) {
    console.error(`❌ Error fetching game ${id}:`, error);
    res.status(500).json({ message: "حدث خطأ في جلب اللعبة", error: error.message });
  }
});

export default router;