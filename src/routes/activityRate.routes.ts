import { Router } from "express";
import { ActivityRateController } from "../controllers/activityRate.controller";
import { adminMiddleware, authMiddleware } from "../middlewares/auth.middleware";

// CREATE ROUTER
const router = Router();

/**
 *  ROUTES
 */

// CREATE ACTIVITY RATE
router.post("/",authMiddleware, adminMiddleware, ActivityRateController.createActivityRate);

// FETCH ACTIVITY RATES
router.get("/", ActivityRateController.fetchActivityRates);

// GET ACTIVITY RATE BY ID
router.get("/:id", ActivityRateController.getActivityRateById);

// UPDATE ACTIVITY RATE
router.patch("/:id", authMiddleware, adminMiddleware, ActivityRateController.updateActivityRate);

// DELETE ACTIVITY RATE
router.delete("/:id", authMiddleware, adminMiddleware, ActivityRateController.deleteActivityRate);

// EXPORT ROUTER
export default router;
