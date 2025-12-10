import { Router } from "express";
import cloudinary from "../config/cloudinary";  // استيراد Cloudinary
import { db } from "../config/firebase";       // استيراد Firebase
import { verifyAuth } from "../middlewares/verifyAuth"; // تأكيد التوثيق
import multer from "multer"; // استيراد multer

// تعريف نوع النتيجة من Cloudinary
interface UploadApiResponse {
  secure_url: string;
  // يمكنك إضافة خصائص أخرى هنا إذا لزم الأمر
}

const router = Router();

// إعداد multer لحفظ الملفات في ذاكرة السيرفر
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// رفع صورة الملف الشخصي
router.post("/upload-profile-picture", verifyAuth, upload.single('file'), async (req, res) => {
  try {
    const { userId } = req.body; // يجب أن يكون userId من بيانات المستخدم
    const file = req.file; // الوصول إلى الملف الذي تم رفعه

    if (!file) {
      return res.status(400).json({ message: "يجب إرسال صورة الملف الشخصي" });
    }

    // رفع الصورة إلى Cloudinary باستخدام upload_stream مع buffer
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          resolve(result as UploadApiResponse);  // تحديد نوع النتيجة هنا
        }
      );

      stream.end(file.buffer); // تمرير Buffer هنا
    });

    // تحديث صورة الملف الشخصي في Firestore
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
