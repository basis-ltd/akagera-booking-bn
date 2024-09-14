import { Request, Response, NextFunction } from 'express';
import { SeatsAdjustmentService } from '../services/seatsAdjustment.service';
import { AuthenticatedRequest } from '../types/auth.types';

// INITIALIZE SEATS ADJUSTMENT SERVICE
const seatsAdjustmentService = new SeatsAdjustmentService();

export const SeatsAdjustmentController = {
  // CREATE SEATS ADJUSTMENT
  async createSeatsAdjustment(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        adjustedSeats,
        startDate,
        endDate,
        reason,
        activityScheduleId,
        userId,
      } = req.body;

      const { user } = req as AuthenticatedRequest;

      // CREATE SEATS ADJUSTMENT
      const newSeatsAdjustment =
        await seatsAdjustmentService.createSeatsAdjustment({
          adjustedSeats,
          startDate,
          endDate,
          reason,
          activityScheduleId,
          userId: user?.id,
        });

      // RETURN RESPONSE
      return res.status(201).json({
        message: 'Seats adjustment created successfully!',
        data: newSeatsAdjustment,
      });
    } catch (error) {
      next(error);
    }
  },

  // FETCH SEATS ADJUSTMENTS
  async fetchSeatsAdjustments(req: Request, res: Response, next: NextFunction) {
    try {
      const { size = 10, page = 0, activityScheduleId, userId } = req.query;
      let condition: object = {
        activityScheduleId,
        userId,
      };

      // FETCH SEATS ADJUSTMENTS
      const seatsAdjustments =
        await seatsAdjustmentService.fetchSeatsAdjustments({
          size: Number(size),
          page: Number(page),
          condition,
        });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Seats adjustments fetched successfully!',
        data: seatsAdjustments,
      });
    } catch (error) {
      next(error);
    }
  },
};
