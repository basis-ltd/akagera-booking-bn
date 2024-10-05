import { Router } from 'express';
import { LogsController } from '../controllers/logs.controller';

// CREATE ROUTER
const router = Router();

/**
 * ROUTES
 */

// FETCH ACTIVITIES LOGS
router.get('/activities', LogsController.fetchActivitiesLogs);

// FETCH ERROR LOGS
router.get('/errors', LogsController.fetchErrorLogs);

// FETCH CRITICAL LOGS
router.get('/critical', LogsController.fetchCriticalLogs);

// EXPORT ROUTER
export default router;
