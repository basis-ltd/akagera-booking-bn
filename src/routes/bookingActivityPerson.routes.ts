import { Router } from "express";
import { BookingActivityPersonController } from "../controllers/bookingActivityPerson.controller";

// CREATE ROUTER
const router = Router();

/**
 *  ROUTES
 */

// CREATE BOOKING ACTIVITY PERSON
router.post("/", BookingActivityPersonController.createBookingActivityPerson);

// FETCH BOOKING ACTIVITY PEOPLE
router.get("/", BookingActivityPersonController.fetchBookingActivityPeople);

// FETCH BOOKING ACTIVITY PERSON DETAILS
router.get("/:id", BookingActivityPersonController.getBookingActivityPersonDetails);

// DELETE BOOKING ACTIVITY PERSON
router.delete("/:id", BookingActivityPersonController.deleteBookingActivityPerson);

// EXPORT ROUTER
export default router;
