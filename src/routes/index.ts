import { Router } from 'express';
import authRoutes from './auth.routes';

// CREATE ROUTER
const router = Router();

/**
 * ROUTES
 */

// AUTH
router.use('/auth', authRoutes);

// EXPORT ROUTER
export default router;
