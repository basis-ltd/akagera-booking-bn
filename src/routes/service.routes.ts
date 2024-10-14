import { Router } from "express";
import { ServiceController } from "../controllers/service.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/auth.middleware";

// CREATE ROUTER
const router = Router();

/**
 * ROUTES
 */

// CREATE SERVICE
router.post("/", authMiddleware, adminMiddleware, ServiceController.createService);

// FETCH SERVICES
router.get("/", ServiceController.fetchServices);

// UPDATE SERVICE
router.patch("/:id", authMiddleware, adminMiddleware, ServiceController.updateService);

// GET SERVICE DETAILS
router.get("/:id", ServiceController.getServiceDetails);

// DELETE SERVICE
router.delete("/:id", authMiddleware, adminMiddleware, ServiceController.deleteService);

// EXPORT ROUTER
export default router;
