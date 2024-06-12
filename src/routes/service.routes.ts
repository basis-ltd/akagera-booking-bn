import { Router } from "express";
import { ServiceController } from "../controllers/service.controller";

// CREATE ROUTER
const router = Router();

/**
 * ROUTES
 */

// CREATE SERVICE
router.post("/", ServiceController.createService);

// FETCH SERVICES
router.get("/", ServiceController.fetchServices);

// UPDATE SERVICE
router.patch("/:id", ServiceController.updateService);

// GET SERVICE DETAILS
router.get("/:id", ServiceController.getServiceDetails);

// DELETE SERVICE
router.delete("/:id", ServiceController.deleteService);

// EXPORT ROUTER
export default router;
