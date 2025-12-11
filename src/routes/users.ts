import { Router } from "express";
import { createUser } from "../controllers/usersController";  // تأكد من المسار الصحيح

const router = Router();

/**
 * @swagger
 * /users/create:
 *   post:
 *     summary: Create a new user
 *     description: Adds or updates a user in the Firestore database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               user_id:
 *                 type: string
 *               image:
 *                 type: string
 *               name-ar:
 *                 type: string
 *               name-en:
 *                 type: string
 *               phone:
 *                 type: string
 *               user_type:
 *                 type: string
 *     responses:
 *       200:
 *         description: User successfully added or updated
 *       400:
 *         description: Missing required fields (email or user_id)
 *       500:
 *         description: Internal server error
 */
router.post("/create", createUser);  // مسار إنشاء المستخدم

export default router;
