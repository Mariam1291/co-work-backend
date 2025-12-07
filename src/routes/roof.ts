// src/routes/roof.ts
import { Router } from "express";
import { getAllRoof, getRoofById, getRoofByBranch } from "../controllers/roofController";

const router = Router();

router.get("/", getAllRoof);
router.get("/:roofId", getRoofById);
router.get("/branch/:branchId", getRoofByBranch);

module.exports = router;
