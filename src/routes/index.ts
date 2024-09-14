import { Router } from 'express';
import authRoutes from './auth.routes';
import activityRoutes from './activity.routes';
import activityRateRoutes from './activityRate.routes';
import activityScheduleRoutes from './activitySchedule.routes';
import bookingRoutes from './booking.routes';
import bookingActivityRoutes from './bookingActivity.routes';
import bookingPersonRoutes from './bookingPerson.routes';
import bookingVehicleRoutes from './bookingVehicle.routes';
import serviceRoutes from './service.routes';
import bookingaActivityPersonRoutes from './bookingActivityPerson.routes';
import userRoutes from './user.routes';
import paymentRoutes from './payment.routes';
import termsRoutes from './terms.routes';
import seatsAdjustmentRoutes from './seatsAdjustment.routes';

// CREATE ROUTER
const router = Router();

/**
 * ROUTES
 */

// AUTH
router.use('/auth', authRoutes);

// ACTIVITY
router.use('/activities', activityRoutes);

// ACTIVITY RATE
router.use('/activity-rates', activityRateRoutes);

// ACTIVITY SCHEDULE
router.use('/activity-schedules', activityScheduleRoutes);

// BOOKING
router.use('/bookings', bookingRoutes);

// BOOKING ACTIVITY
router.use('/booking-activities', bookingActivityRoutes);

// BOOKING PERSON
router.use('/booking-people', bookingPersonRoutes);

// BOOKING VEHICLE
router.use('/booking-vehicles', bookingVehicleRoutes);

// SERVICE
router.use('/services', serviceRoutes);

// BOOKING ACTIVITY PERSON
router.use('/booking-activity-people', bookingaActivityPersonRoutes);

// USER ROUTES
router.use('/users', userRoutes);

// PAYMENT ROUTES
router.use('/payments', paymentRoutes);

// TERMS ROUTES
router.use('/terms', termsRoutes);

// SEATS ADJUSTMENT ROUTES
router.use('/seats-adjustments', seatsAdjustmentRoutes);

// EXPORT ROUTER
export default router;
