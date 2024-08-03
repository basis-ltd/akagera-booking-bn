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

// EXPORT ROUTER
export default router;
