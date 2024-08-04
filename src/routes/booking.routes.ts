import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";

// CREATE ROUTER
const router = Router();

/**
 *  ROUTES
 */

// CREATE BOOKING
router.post("/", BookingController.createBooking);

// FETCH BOOKINGS
router.get("/", BookingController.fetchBookings);

// FETCH TIME SERIES BOOKINGS
router.get("/time-series", BookingController.fetchTimeSeriesBookings);

// UPDATE BOOKING
router.patch("/:id", BookingController.updateBooking);

// DELETE BOOKING
router.delete("/:id", BookingController.deleteBooking);

// GET BOOKING
router.get("/:id", BookingController.getBookingById);

// FETCH BOOKING STATUSES
router.get("/all/statuses", BookingController.fetchBookingStatuses);

// CONFIRM BOOKING
router.patch("/:id/submit", BookingController.submitBooking);

// UPDATE BOOKING CONSENT
router.patch("/:id/consent", BookingController.updateBookingConsent);

// GET BOOKING AMOUNT
router.get("/:id/amount", BookingController.calculateBookingAmount);

// EXPORT ROUTER
export default router;
