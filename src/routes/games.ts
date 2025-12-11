// src/routes/games.routes.ts
import { Router } from "express";
import { getAllGames, getGameById, createGame } from "../controllers/gamecontroller";

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
router.get("/all", getAllGames); 

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
 *       404:
 *         description: Game not found
 */
router.get("/:id", getGameById); 

/**
 * @swagger
 * /games:
 *   post:
 *     summary: Create a new game
 *     description: Allows creating a new game and uploading related images
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nameAr:
 *                 type: string
 *               nameEn:
 *                 type: string
 *               descriptionAr:
 *                 type: string
 *               descriptionEn:
 *                 type: string
 *               imageFiles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Successfully created the game
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: string
 */
router.post("/", createGame); 

export default router;
