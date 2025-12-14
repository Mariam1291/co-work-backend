// src/routes/profilePicture.routes.ts
import { Router } from "express";
import cloudinary from "../config/cloudinary";  // استيراد Cloudinary
import { db } from "../config/firebase";       // استيراد Firebase
import { verifyAuth } from "../middlewares/verifyAuth"; // تأكيد التوثيق
import multer from "multer"; // استيراد multer

interface UploadApiResponse {
  secure_url: string; // رابط الصورة الآمن
}

const router = Router();

// إعداد multer لحفظ الملفات في ذاكرة السيرفر
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * @swagger
 * /upload-profile-picture:
 *   post:
 *     summary: Upload a profile picture
 *     description: Uploads a user's profile picture and updates it in the database.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID for which the profile picture is being uploaded
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The image file to be uploaded
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 profilePicture:
 *                   type: string
 *                   description: The URL of the uploaded profile picture
 *       400:
 *         description: Missing file or userId
 *       500:
 *         description: Internal Server Error
 */
router.post("/upload-profile-picture", verifyAuth, upload.single('file'), async (req, res) => {
  try {
    const { userId } = req.body; // استخراج الـ userId من الطلب
    const file = req.file; // الوصول إلى الملف الذي تم رفعه

    if (!file) {
      return res.status(400).json({ message: "يجب إرسال صورة الملف الشخصي" });
    }

    // رفع الصورة إلى Cloudinary
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" }, // لتحديد النوع التلقائي للصورة
        (error, result) => {
          if (error) reject(error);
          resolve(result as UploadApiResponse);
        }
      );

      stream.end(file.buffer); // تمرير الصورة المخزنة في الذاكرة (buffer)
    });

    // تخزين رابط الصورة في Firestore داخل حقل `profilePicture` للمستخدم
    await db.collection("users").doc(userId).update({
      profilePicture: result.secure_url, // حفظ الرابط الآمن للصورة
    });

    res.status(200).json({
      message: "تم رفع صورة الملف الشخصي بنجاح",
      profilePicture: result.secure_url, // إرسال الرابط الآمن للصورة
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ message: "حدث خطأ في رفع صورة الملف الشخصي" });
  }
});

export default router;
