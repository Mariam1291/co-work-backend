import { Router } from "express";
import { db } from "../config/firebase";  // تأكد من استيراد db بشكل صحيح
import cloudinary from "../config/cloudinary"; // تأكد من استيراد Cloudinary بشكل صحيح
import { Request, Response } from "express";

const router = Router();

// جلب كل الألعاب
router.get("/all", async (req: Request, res: Response) => {
  try {
    const gamesSnapshot = await db.collection("games").get(); // استرجاع الألعاب من Firestore
    const games = gamesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        nameAr: data["name-ar"] || data.nameAr || data.name || "",
        nameEn: data["name-en"] || data.nameEn || data.name || "",
        descriptionAr: data["description-ar"] || data.descriptionAr || "",
        descriptionEn: data["description-en"] || data.descriptionEn || "",
        image: {
          img1: data.image.img1 || "",
          img2: data.image.img2 || "",
        },
        isActive: data.is_active ?? data.isActive ?? true,
      };
    });

    res.json(games);  // إرسال البيانات إلى الـ Frontend
  } catch (error) {
    console.error("❌ Error fetching all games:", error);
    res.status(500).json({ message: "حدث خطأ في جلب الألعاب", error: error.message });
  }
});

// جلب لعبة واحدة بالـ ID
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const gameDoc = await db.collection("games").doc(id).get();

    if (!gameDoc.exists) {
      return res.status(404).json({ message: "اللعبة غير موجودة" });
    }

    const data = gameDoc.data()!;
    const game = {
      id: gameDoc.id,
      nameAr: data["name-ar"] || data.nameAr || data.name || "",
      nameEn: data["name-en"] || data.nameEn || data.name || "",
      descriptionAr: data["description-ar"] || data.descriptionAr || "",
      descriptionEn: data["description-en"] || data.descriptionEn || "",
      image: {
        img1: data.image.img1 || "",
        img2: data.image.img2 || "",
      },
      isActive: data.is_active ?? data.isActive ?? true,
    };

    res.json(game);  // إرسال البيانات الخاصة باللعبة إلى الـ Frontend
  } catch (error) {
    console.error(`❌ Error fetching game ${id}:`, error);
    res.status(500).json({ message: "حدث خطأ في جلب اللعبة", error: error.message });
  }
});

// إضافة لعبة جديدة مع رفع الصور إلى Cloudinary
router.post("/", async (req: Request, res: Response) => {
  const { nameAr, nameEn, descriptionAr, descriptionEn, imageFiles } = req.body;

  try {
    const uploadedImages = await Promise.all(
      imageFiles.map(async (file: any) => {
        const result = await cloudinary.uploader.upload(file.path);
        return result.secure_url;
      })
    );

    const newGame = {
      nameAr,
      nameEn,
      descriptionAr,
      descriptionEn,
      image: {
        img1: uploadedImages[0],  // أول صورة
        img2: uploadedImages[1],  // ثاني صورة
      },
      is_active: true,
    };

    const gameRef = await db.collection("games").add(newGame);
    res.status(201).json({ message: "Game created successfully", id: gameRef.id });
  } catch (error) {
    console.error("❌ Error creating game:", error);
    res.status(500).json({ message: "حدث خطأ في إضافة اللعبة", error: error.message });
  }
});

export default router;
