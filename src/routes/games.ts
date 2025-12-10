// src/routes/gamesRoutes.ts
import { Router } from "express";
import {
  getAllGames,
  getGameById,
  createGame
} from "../controllers/gamecontroller"; // التأكد من استيراد الـ Controller بشكل صحيح

const router = Router();

/**
 * @swagger
 * /games/all:
 *   get:
 *     summary: Get all games
 *     description: Retrieves all the games from the database
 *     responses:
 *       200:
 *         description: A list of games
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 */
router.get("/all", getAllGames); // Route to get all games

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     summary: Get game by ID
 *     description: Returns the game for a specific ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the game to fetch
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Game data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 nameAr:
 *                   type: string
 *                 nameEn:
 *                   type: string
 *                 descriptionAr:
 *                   type: string
 *                 descriptionEn:
 *                   type: string
 *                 image:
 *                   type: object
 *                   properties:
 *                     img1:
 *                       type: string
 *                     img2:
 *                       type: string
 *                 isActive:
 *                   type: boolean
 *       404:
 *         description: Game not found
 */
router.get("/:id", getGameById); // Route to get a game by ID

/**
 * @swagger
 * /games:
 *   post:
 *     summary: Create a new game
 *     description: Add a new game to the database along with images.
 *     tags: [Games]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nameAr:
 *                 type: string
 *                 description: Arabic name of the game
 *               nameEn:
 *                 type: string
 *                 description: English name of the game
 *               descriptionAr:
 *                 type: string
 *                 description: Arabic description of the game
 *               descriptionEn:
 *                 type: string
 *                 description: English description of the game
 *               imageFiles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Base64 image files for the game (image upload via Cloudinary)
 *     responses:
 *       201:
 *         description: Successfully created a new game
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
router.post("/", createGame); // Route to create a new game

export default router; // تصدير الـ Routes
