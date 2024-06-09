import { Router } from 'express';
import authRoutes from './auth.routes';
import activityRoutes from './activity.routes';
import activityRateRoutes from './activityRate.routes';

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

// EXPORT ROUTER
export default router;
