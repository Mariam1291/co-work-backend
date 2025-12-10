// src/routes/auth.routes.ts
import { Router } from "express";
import { verifyAuth } from "../middlewares/verifyAuth";

const router = Router();

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get authenticated user details
 *     description: This endpoint returns the details of the authenticated user.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The ID of the user
 *                     email:
 *                       type: string
 *                       description: The email of the user
 *                     name:
 *                       type: string
 *                       description: The name of the user
 *                     role:
 *                       type: string
 *                       description: The role of the user (e.g., admin, user)
 *       401:
 *         description: Unauthorized - The user is not authenticated or token is invalid
 *       500:
 *         description: Internal server error
 */
router.get("/me", verifyAuth, async (req: any, res) => {
  try {
    const user = req.user;  // بيانات المستخدم تم إضافتها بواسطة verifyAuth

    res.json({ user });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router; // تأكد من تصديره هكذا
