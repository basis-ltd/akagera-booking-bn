import { Router } from "express";
import { BookingActivityController } from "../controllers/bookingActivity.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

// CREATE ROUTER
const router = Router();

/**
 *  ROUTES
 */

// CREATE BOOKING ACTIVITY
router.post("/", BookingActivityController.createBookingActivity);

// FETCH BOOKING ACTIVITIES
router.get("/", BookingActivityController.fetchBookingActivities);

// FETCH POPULAR ACTIVITIES
router.get("/popular", authMiddleware, BookingActivityController.fetchPopularActivities);

// GET BOOKING ACTIVITY BY ID
router.get("/:id", BookingActivityController.getBookingActivityById);

// DELETE BOOKING ACTIVITY
router.delete("/:id", BookingActivityController.deleteBookingActivity);

// UPDATE BOOKING ACTIVITY
router.patch("/:id", BookingActivityController.updateBookingActivity)

// EXPORT ROUTER
export default router;
