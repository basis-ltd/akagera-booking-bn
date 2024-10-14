import { Router } from 'express';
import { ActivityController } from '../controllers/activity.controller';
import {
  adminMiddleware,
  authMiddleware,
} from '../middlewares/auth.middleware';

// CREATE ROUTER
const router = Router();

/**
 *  ROUTES
 */

// CREATE ACTIVITY
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  ActivityController.createActivity
);

// UPDATE ACTIVITY
router.patch(
  '/:id',
  authMiddleware,
  adminMiddleware,
  ActivityController.updateActivity
);

// FETCH ACTIVITIES
router.get('/', ActivityController.fetchActivities);

// DELETE ACTIVITY
router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  ActivityController.deleteActivity
);

// FIND ACTIVITY BY ID
router.get('/:id', ActivityController.fetchActivityById);

// EXPORT ROUTER
export default router;
