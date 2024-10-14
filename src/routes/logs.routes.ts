import { Router } from 'express';
import { LogsController } from '../controllers/logs.controller';
import { adminMiddleware, authMiddleware } from '../middlewares/auth.middleware';

// CREATE ROUTER
const router = Router();

/**
 * ROUTES
 */

// FETCH ACTIVITIES LOGS
router.get('/activities', authMiddleware, adminMiddleware, LogsController.fetchActivitiesLogs);

// FETCH ERROR LOGS
router.get('/errors', authMiddleware, adminMiddleware, LogsController.fetchErrorLogs);

// FETCH CRITICAL LOGS
router.get('/critical', authMiddleware, adminMiddleware, LogsController.fetchCriticalLogs);

// EXPORT ROUTER
export default router;
