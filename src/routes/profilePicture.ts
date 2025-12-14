// src/routes/profilePicture.routes.ts

import { Router, Request, Response } from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary";
import { db } from "../config/firebase";
import { verifyAuth } from "../middlewares/verifyAuth";

interface UploadApiResponse {
  secure_url: string;
}

const router = Router();

/**
 * Multer configuration
 * Store file in memory (buffer)
 */
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * POST /profilePicture/upload-profile-picture
 * Upload user profile picture
 */
router.post(
  "/upload-profile-picture",
  verifyAuth,
  upload.single("file"),
  async (req: any, res: Response) => {
    try {
      // userId always comes from Firebase token (NOT from body)
      const userId = req.user?.uid;
      const file = req.file;

      if (!userId) {
        return res.status(401).json({
          message: "Unauthorized user",
        });
      }

      if (!file) {
        return res.status(400).json({
          message: "Profile picture file is required",
        });
      }

      // Upload image to Cloudinary
      const uploadResult = await new Promise<UploadApiResponse>(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: "image",
              folder: "profile_pictures",
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result as UploadApiResponse);
            }
          );

          stream.end(file.buffer);
        }
      );

      // Save image URL in Firestore (merge to avoid missing doc error)
      await db
        .collection("users")
        .doc(userId)
        .set(
          {
            profilePicture: uploadResult.secure_url,
            updatedAt: new Date(),
          },
          { merge: true }
        );

      return res.status(200).json({
        success: true,
        profilePicture: uploadResult.secure_url,
      });
    } catch (error) {
      console.error("UPLOAD PROFILE PICTURE ERROR:", error);
      return res.status(500).json({
        message: "Failed to upload profile picture",
      });
    }
  }
);

export default router;