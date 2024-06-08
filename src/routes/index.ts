import { Router } from 'express';
import authRoutes from './auth.routes';
import activityRoutes from './activity.routes';

// CREATE ROUTER
const router = Router();

/**
 * ROUTES
 */

// AUTH
router.use('/auth', authRoutes);

// ACTIVITY
router.use('/activities', activityRoutes);

// EXPORT ROUTER
export default router;
