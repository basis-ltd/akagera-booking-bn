import { Router } from 'express';
import { BookingPersonController } from '../controllers/bookingPerson.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

// CREATE ROUTER
const router = Router();

/**
 *  ROUTES
 */

// CREATE BOOKING PERSON
router.post('/', BookingPersonController.createBookingPerson);

// FETCH BOOKING PEOPLE
router.get('/', BookingPersonController.fetchBookingPeople);

// FETCH POPULAR BOOKING PEOPLE
router.get('/popular', authMiddleware, BookingPersonController.fetchPopularBookingPeople);

// FETCH BOOKING PEOPLE STATS
router.get('/stats', authMiddleware, BookingPersonController.fetchBookingPeopleStats);

// GET BOOKING PERSON DETAILS
router.get('/:id', BookingPersonController.getBookingPersonDetails);

// UPDATE BOOKING PERSON
router.patch('/:id', BookingPersonController.updateBookingPerson);

// DELETE BOOKING PERSON
router.delete('/:id', BookingPersonController.deleteBookingPerson);

// EXPORT ROUTER
export default router;
