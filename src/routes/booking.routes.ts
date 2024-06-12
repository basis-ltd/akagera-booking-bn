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

// UPDATE BOOKING
router.patch("/:id", BookingController.updateBooking);

// DELETE BOOKING
router.delete("/:id", BookingController.deleteBooking);

// GET BOOKING
router.get("/:id", BookingController.getBookingById);

// EXPORT ROUTER
export default router;
