import { Router } from 'express';
import { SettingsController } from '../controllers/settings.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/auth.middleware';

// CREATE ROUTER
const router = Router();

/**
 * ROUTES
 */

// SET USD RATE
router.patch('/usd-rate', authMiddleware, adminMiddleware, SettingsController.setUsdRate);

// GET USD RATE
router.get('/usd-rate', authMiddleware, adminMiddleware, SettingsController.getUsdRate);

// EXPORT ROUTER
export default router;
