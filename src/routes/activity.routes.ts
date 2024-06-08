import { Router } from "express";
import { ActivityController } from "../controllers/activity.controller";

// CREATE ROUTER
const router = Router();

/**
 *  ROUTES
 */

// CREATE ACTIVITY
router.post("/", ActivityController.createActivity);

// UPDATE ACTIVITY
router.patch("/:id", ActivityController.updateActivity);

// FETCH ACTIVITIES
router.get("/", ActivityController.fetchActivities);

// DELETE ACTIVITY
router.delete("/:id", ActivityController.deleteActivity);

// FIND ACTIVITY BY ID
router.get("/:id", ActivityController.fetchActivityById);

// EXPORT ROUTER
export default router;
