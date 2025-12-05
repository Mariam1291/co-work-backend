import { Router } from "express";
import {
  getAllEvents,
  getEventById,
  getEventsByBranch,
} from "../controllers/eventController";

const router = Router();

router.get("/", getAllEvents);
router.get("/:eventId", getEventById);
router.get("/branch/:branchId", getEventsByBranch);

export default router;
