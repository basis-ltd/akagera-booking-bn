import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { bookingMiddleware } from '../middlewares/booking.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

// CREATE ROUTER
const router = Router();

/**
 *  ROUTES
 */

// CREATE BOOKING
router.post('/', BookingController.createBooking);

// FETCH BOOKINGS
router.get('/', BookingController.fetchBookings);

// FETCH TIME SERIES BOOKINGS
router.get('/time-series', authMiddleware, BookingController.fetchTimeSeriesBookings);

// UPDATE BOOKING
router.patch('/:id', BookingController.updateBooking);

// DELETE BOOKING
router.delete('/:id', BookingController.deleteBooking);

// GET BOOKING
router.get('/:id', BookingController.getBookingById);

// FETCH BOOKING STATUSES
router.get('/all/statuses', BookingController.fetchBookingStatuses);

// CONFIRM BOOKING
router.patch('/:id/submit', BookingController.submitBooking);

// UPDATE BOOKING CONSENT
router.patch('/:id/consent', BookingController.updateBookingConsent);

// DOWNLOAD BOOKING CONSENT
router.get('/:id/consent/download', BookingController.downloadBookingConsent);

// GET BOOKING AMOUNT
router.get('/:id/amount', BookingController.calculateBookingAmount);

// GET BOOKING EMAIL
router.get('/search/email', BookingController.findBookingEmail);

// REQUEST BOOKING OTP
router.post('/request-otp', BookingController.requestBookingOTP);

// VERIFY BOOKING OTP
router.post('/verify-otp', BookingController.verifyBookingOTP);

// SEARCH BOOKINGS
router.get('/search/draft/all', bookingMiddleware, BookingController.fetchBookings);

// EXPORT ROUTER
export default router;
