// src/routes/profilePicture.ts
import { Router, Request, Response } from "express"; // استيراد Response
import cloudinary from "../config/cloudinary";
import { db } from "../config/firebase";
import { verifyAuth } from "../middlewares/verifyAuth";
import multer from "multer";

// ملاحظة: افترض أن لديك ملف types/express.d.ts يحتوي على التعريف التالي:
/*
declare namespace Express {
  export interface Request {
    user?: {
      uid: string;
      email?: string;
    };
  }
}
*/
// إذا كان لديك هذا التعريف، فلن تحتاج إلى AuthRequest بعد الآن.
// سأقوم بإزالة AuthRequest لتبسيط الكود والاعتماد على التعريف العام.

interface UploadApiResponse {
  secure_url: string;
}

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// تم حذف AuthRequest والاعتماد على التعريف العام في express.d.ts
router.post("/upload-profile-picture", verifyAuth, upload.single('file'), async (req: Request, res: Response) => {
  try {
    // التعديل: استخراج uid من كائن الطلب الذي يضيفه verifyAuth
    const userId = req.user?.uid; // تم التغيير من req.user?.id إلى req.user?.uid

    if (!userId) {
      return res.status(401).json({ message: "المستخدم غير موثق أو التوكن غير صالح" });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "يجب إرسال صورة الملف الشخصي" });
    }

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          resolve(result as UploadApiResponse);
        }
      );
      stream.end(file.buffer);
    });

    // استخدام userId (الذي هو الآن uid) لتحديث المستند
    await db.collection("users").doc(userId).update({
      profilePicture: result.secure_url,
    });

    res.status(200).json({
      message: "تم رفع صورة الملف الشخصي بنجاح",
      profilePicture: result.secure_url,
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ message: "حدث خطأ في رفع صورة الملف الشخصي" });
  }
});

export default router;
