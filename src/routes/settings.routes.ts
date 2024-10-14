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

// FETCH SETTINGS
router.get('/', authMiddleware, adminMiddleware, SettingsController.fetchSettings);

// GET USD RATE
router.get('/usd-rate', authMiddleware, adminMiddleware, SettingsController.getUsdRate);

// UPDATE ADMIN EMAIL
router.patch('/admin-email', authMiddleware, adminMiddleware, SettingsController.updateAdminEmail);

// FETCH USD RATE HISTORY
router.get('/usd-rate-history', authMiddleware, adminMiddleware, SettingsController.fetchUsdRateHistory);

// FETCH ADMIN EMAIL HISTORY
router.get('/admin-email-history', authMiddleware, adminMiddleware, SettingsController.fetchAdminEmailHistory);

// UPDATE SETTINGS
router.patch('/:id', authMiddleware, adminMiddleware, SettingsController.updateSettings);

// EXPORT ROUTER
export default router;
