import { Router } from "express";
import { BookingActivityController } from "../controllers/bookingActivity.controller";

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
router.get("/popular", BookingActivityController.fetchPopularActivities);

// GET BOOKING ACTIVITY BY ID
router.get("/:id", BookingActivityController.getBookingActivityById);

// DELETE BOOKING ACTIVITY
router.delete("/:id", BookingActivityController.deleteBookingActivity);

// UPDATE BOOKING ACTIVITY
router.patch("/:id", BookingActivityController.updateBookingActivity);

// CALCULATE REMAINING SEATS
router.get("/seats/remaining", BookingActivityController.calculateRemainingSeats);

// EXPORT ROUTER
export default router;
