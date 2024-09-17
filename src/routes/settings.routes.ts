import { Router } from 'express';
import { SettingsController } from '../controllers/settings.controller';

// CREATE ROUTER
const router = Router();

/**
 * ROUTES
 */

// SET USD RATE
router.patch('/usd-rate', SettingsController.setUsdRate);

// EXPORT ROUTER
export default router;
