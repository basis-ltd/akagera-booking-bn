import { Router } from "express";
import { ActivityScheduleController } from "../controllers/activitySchedule.controller";

// CREATE ROUTER
const router = Router();

/**
 *  ROUTES
 */

// CREATE ACTIVITY SCHEDULE
router.post("/", ActivityScheduleController.createActivitySchedule);

// FETCH ACTIVITY SCHEDULES
router.get("/", ActivityScheduleController.fetchActivitySchedules);

// GET ACTIVITY SCHEDULE BY ID
router.get("/:id", ActivityScheduleController.getActivityScheduleById);

// UPDATE ACTIVITY SCHEDULE
router.patch("/:id", ActivityScheduleController.updateActivitySchedule);

// DELETE ACTIVITY SCHEDULE
router.delete("/:id", ActivityScheduleController.deleteActivitySchedule);

// EXPORT ROUTER
export default router;
