import { Router } from "express";
import { ActivityRateVariationController } from "../controllers/activityRateVariation.controller";

// CREATE ROUTER
const router = Router();

/**
 *  ROUTES
 */

// CREATE ACTIVITY RATE VARIATION
router.post("/", ActivityRateVariationController.createActivityRateVariation);

// FETCH ACTIVITY RATE VARIATIONS
router.get("/", ActivityRateVariationController.fetchActivityRateVariations);

// GET ACTIVITY RATE VARIATION BY ID
router.get("/:id", ActivityRateVariationController.getActivityRateVariationById);

// UPDATE ACTIVITY RATE VARIATION
router.patch("/:id", ActivityRateVariationController.updateActivityRateVariation);

// DELETE ACTIVITY RATE VARIATION
router.delete("/:id", ActivityRateVariationController.deleteActivityRateVariation);

// EXPORT ROUTER
export default router;
