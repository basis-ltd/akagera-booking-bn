import { Request, Response, NextFunction } from 'express';
import { SeatsAdjustmentService } from '../services/seatsAdjustment.service';
import { AuthenticatedRequest } from '../types/auth.types';
import { UUID } from 'crypto';

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

  // UPDATE SEATS ADJUSTMENT
  async updateSeatsAdjustment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { adjustedSeats, startDate, endDate, reason } = req.body;

      // UPDATE SEATS ADJUSTMENT
      const updatedSeatsAdjustment =
        await seatsAdjustmentService.updateSeatsAdjustment({
          id: id as UUID,
          adjustedSeats,
          startDate,
          endDate,
          reason,
        });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Seats adjustment updated successfully!',
        data: updatedSeatsAdjustment,
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE SEATS ADJUSTMENT
  async deleteSeatsAdjustment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // DELETE SEATS ADJUSTMENT
      await seatsAdjustmentService.deleteSeatsAdjustment(id as UUID);

      // RETURN RESPONSE
      return res.status(204).json({
        message: 'Seats adjustment deleted successfully!',
      });
    } catch (error) {
      next(error);
    }
  },
};
