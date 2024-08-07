import { Router } from "express";
import { TermsController } from "../controllers/terms.controller";

// CREATE ROUTER
const router = Router();

/**
 * ROUTES
 */

// GET TERMS OF SERVICE
router.get("/", TermsController.getTermsOfService);

// CREATE TERMS OF SERVICE
router.post("/", TermsController.createTermsOfService);

// UPDATE TERMS OF SERVICE
router.patch("/:id", TermsController.updateTermsOfService);

// EXPORT ROUTER
export default router;
