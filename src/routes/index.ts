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

// EXPORT ROUTER
export default router;
