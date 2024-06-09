import { Router } from 'express';
import authRoutes from './auth.routes';
import activityRoutes from './activity.routes';
import activityRateRoutes from './activityRate.routes';
import activityRateVariationRoutes from './activityRateVariation.routes';
import activityScheduleRoutes from './activitySchedule.routes';

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

// ACTIVITY RATE VARIATION
router.use('/activity-rate-variations', activityRateVariationRoutes);

// ACTIVITY SCHEDULE
router.use('/activity-schedules', activityScheduleRoutes);

// EXPORT ROUTER
export default router;
