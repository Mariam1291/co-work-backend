import { Router } from "express";
import { getAllRoof, getRoofById, getRoofByBranch } from "../controllers/roofController";

const router = Router(); // تأكد من أن `router` تم تعريفه باستخدام `Router()`

/**
 * @swagger
 * /roof:
 *   get:
 *     summary: Get all roofs
 *     description: Fetches all roof details from the database.
 *     responses:
 *       200:
 *         description: Successfully fetched all roofs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the roof.
 *                   name:
 *                     type: string
 *                     description: Name of the roof.
 *                   description:
 *                     type: string
 *                     description: Description of the roof.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get("/", getAllRoof); // Route for fetching all roofs

/**
 * @swagger
 * /roof/{roofId}:
 *   get:
 *     summary: Get a single roof by ID
 *     description: Fetches roof details for a specific roof based on the roof ID.
 *     parameters:
 *       - in: path
 *         name: roofId
 *         required: true
 *         description: The ID of the roof to fetch
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched roof by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *       404:
 *         description: Roof not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Roof not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get("/:roofId", getRoofById); // Route for fetching a roof by ID

/**
 * @swagger
 * /roof/branch/{branchId}:
 *   get:
 *     summary: Get all roofs of a specific branch
 *     description: Fetches all roof details for a specific branch based on the branch ID.
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *         description: The ID of the branch to fetch roofs for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched roofs for the branch
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
 *       404:
 *         description: Branch not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Branch not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get("/branch/:branchId", getRoofByBranch); // Route for fetching roofs by branch ID

export default router;
