import { Router } from "express";
import { getBranches, getBranchById } from "../controllers/branchesController";

const router = Router();

/**
 * @swagger
 * /branches:
 *   get:
 *     summary: Get all branches
 *     description: Fetches all branches from the database.
 *     tags: [Branches]
 *     responses:
 *       200:
 *         description: Successfully fetched all branches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   nameAr:
 *                     type: string
 *                   nameEn:
 *                     type: string
 *                   addressAr:
 *                     type: string
 *                   addressEn:
 *                     type: string
 *                   cityAr:
 *                     type: string
 *                   cityEn:
 *                     type: string
 *                   games:
 *                     type: array
 *                     items:
 *                       type: string
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *                   isActive:
 *                     type: boolean
 *                   roof:
 *                     type: array
 *                     items:
 *                       type: string
 *                   rooms:
 *                     type: array
 *                     items:
 *                       type: string
 *                   phoneNumber:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
router.get("/", getBranches); // Route to get all branches

/**
 * @swagger
 * /branches/{id}:
 *   get:
 *     summary: Get a single branch by ID
 *     description: Fetches a single branch based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the branch to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched the branch by ID
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
 *                 addressAr:
 *                   type: string
 *                 addressEn:
 *                   type: string
 *                 cityAr:
 *                   type: string
 *                 cityEn:
 *                   type: string
 *                 games:
 *                   type: array
 *                   items:
 *                     type: string
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                 isActive:
 *                   type: boolean
 *                 roof:
 *                   type: array
 *                   items:
 *                     type: string
 *                 rooms:
 *                   type: array
 *                   items:
 *                     type: string
 *                 phoneNumber:
 *                   type: string
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getBranchById); // Route to get a branch by ID

export default router; // تصدير المسارات
