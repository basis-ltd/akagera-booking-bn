import { Request, Response, NextFunction } from "express";
import { ActivityRateService } from "../services/activityRate.service";
import { UUID } from "crypto";

// INITIALIZE ACTIVITY RATE SERVICE
const activityRateService = new ActivityRateService();

export const ActivityRateController = {
  // CREATE ACTIVITY RATE
  async createActivityRate(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        name,
        amountUsd,
        amountRwf,
        description,
        disclaimer,
        activityId,
      } = req.body;

      // CREATE ACTIVITY RATE
      const newActivityRate = await activityRateService.createActivityRate({
        name,
        amountUsd,
        amountRwf,
        description,
        disclaimer,
        activityId,
      });

      // RETURN RESPONSE
      return res.status(201).json({
        message: 'Activity rate created successfully!',
        data: newActivityRate,
      });
    } catch (error) {
      next(error);
    }
  },

  // FETCH ACTIVITY RATES
  async fetchActivityRates(req: Request, res: Response, next: NextFunction) {
    try {
      const { activityId, take = 10, skip = 0 } = req.query;
      let condition: object = {};

      // IF ACTIVITY ID PROVIDED
      if (activityId) {
        condition = { ...condition, activityId: activityId };
      }

      // FETCH ACTIVITY RATES
      const activityRates = await activityRateService.fetchActivityRates({
        take: Number(take),
        skip: Number(skip),
        condition,
      });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Activity rates fetched successfully!',
        data: activityRates,
      });
    } catch (error) {
      next(error);
    }
  },

  // FETCH ACTIVITY RATE BY ID
  async getActivityRateById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // FETCH ACTIVITY RATE
      const activityRate = await activityRateService.findActivityRateById(
        id as UUID
      );

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Activity rate fetched successfully!',
        data: activityRate,
      });
    } catch (error) {
      next(error);
    }
  },

  // UPDATE ACTIVITY RATE
  async updateActivityRate(req: Request, res: Response, next: NextFunction) {
    try {

      const { id } = req.params;

      const {
        name,
        amountUsd,
        amountRwf,
        description,
        disclaimer,
      } = req.body;

      // UPDATE ACTIVITY RATE
      const updatedActivityRate = await activityRateService.updateActivityRate({
        id: id as UUID,
        name,
        amountUsd,
        amountRwf,
        description,
        disclaimer,
      });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Activity rate updated successfully!',
        data: updatedActivityRate,
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE ACTIVITY RATE
  async deleteActivityRate(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // DELETE ACTIVITY RATE
      await activityRateService.deleteActivityRate(id as UUID);

      // RETURN RESPONSE
      return res.status(204).json({
        message: 'Activity rate deleted successfully!',
      });
    } catch (error) {
      next(error);
    }
  }
};
