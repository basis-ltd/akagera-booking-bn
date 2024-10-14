import { Router } from "express";
import { ActivityScheduleController } from "../controllers/activitySchedule.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/auth.middleware";

// CREATE ROUTER
const router = Router();

/**
 *  ROUTES
 */

// CREATE ACTIVITY SCHEDULE
router.post("/", authMiddleware, adminMiddleware, ActivityScheduleController.createActivitySchedule);

// FETCH ACTIVITY SCHEDULES
router.get("/", ActivityScheduleController.fetchActivitySchedules);

// GET ACTIVITY SCHEDULE BY ID
router.get("/:id", ActivityScheduleController.getActivityScheduleById);

// UPDATE ACTIVITY SCHEDULE
router.patch("/:id", authMiddleware, adminMiddleware, ActivityScheduleController.updateActivitySchedule);

// DELETE ACTIVITY SCHEDULE
router.delete("/:id", authMiddleware, adminMiddleware, ActivityScheduleController.deleteActivitySchedule);

// CALCULATE REMAINING SEATS
router.get("/:id/seats/remaining", ActivityScheduleController.calculateRemainingSeats);

// EXPORT ROUTER
export default router;
