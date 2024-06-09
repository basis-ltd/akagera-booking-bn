import { Router } from "express";
import { ActivityRateController } from "../controllers/activityRate.controller";

// CREATE ROUTER
const router = Router();

/**
 *  ROUTES
 */

// CREATE ACTIVITY RATE
router.post("/", ActivityRateController.createActivityRate);

// FETCH ACTIVITY RATES
router.get("/", ActivityRateController.fetchActivityRates);

// GET ACTIVITY RATE BY ID
router.get("/:id", ActivityRateController.getActivityRateById);

// UPDATE ACTIVITY RATE
router.patch("/:id", ActivityRateController.updateActivityRate);

// DELETE ACTIVITY RATE
router.delete("/:id", ActivityRateController.deleteActivityRate);

// EXPORT ROUTER
export default router;
