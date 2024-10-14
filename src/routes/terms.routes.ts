import { Router } from "express";
import { TermsController } from "../controllers/terms.controller";
import { adminMiddleware } from "../middlewares/auth.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";

// CREATE ROUTER
const router = Router();

/**
 * ROUTES
 */

// GET TERMS OF SERVICE
router.get("/", TermsController.getTermsOfService);

// CREATE TERMS OF SERVICE
router.post("/", authMiddleware, adminMiddleware, TermsController.createTermsOfService);

// UPDATE TERMS OF SERVICE
router.patch("/:id", authMiddleware, adminMiddleware, TermsController.updateTermsOfService);

// EXPORT ROUTER
export default router;
