import { Router } from 'express';
import { SeatsAdjustmentController } from '../controllers/seatsAdjustment.controller';
import {
  adminMiddleware,
  authMiddleware,
} from '../middlewares/auth.middleware';

// CREATE ROUTER
const router = Router();

/**
 * ROUTES
 */

// CREATE SEATS ADJUSTMENT
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  SeatsAdjustmentController.createSeatsAdjustment
);

// FETCH SEATS ADJUSTMENTS
router.get('/', SeatsAdjustmentController.fetchSeatsAdjustments);

// UPDATE SEATS ADJUSTMENT
router.patch(
  '/:id',
  authMiddleware,
  adminMiddleware,
  SeatsAdjustmentController.updateSeatsAdjustment
);

// DELETE SEATS ADJUSTMENT
router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  SeatsAdjustmentController.deleteSeatsAdjustment
);

// EXPORT ROUTER
export default router;
