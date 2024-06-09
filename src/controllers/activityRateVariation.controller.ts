import { Request, Response, NextFunction } from 'express';
import { ActivityRateVariationService } from '../services/activityRateVariation.service';
import { UUID } from 'crypto';

// INITIALIZE ACTIVITY RATE VARIATION SERVICE
const activityRateVariationService = new ActivityRateVariationService();

export const ActivityRateVariationController = {
  // CREATE ACTIVITY RATE VARIATION
  async createActivityRateVariation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        name,
        amountUsd,
        amountRwf,
        description,
        disclaimer,
        activityRateId,
      } = req.body;

      // CREATE ACTIVITY RATE VARIATION
      const newActivityRateVariation =
        await activityRateVariationService.createActivityRateVariation({
          name,
          amountUsd,
          amountRwf,
          description,
          disclaimer,
          activityRateId,
        });

      // RETURN RESPONSE
      return res.status(201).json({
        message: 'Activity rate variation created successfully!',
        data: newActivityRateVariation,
      });
    } catch (error) {
      next(error);
    }
  },

  // FETCH ACTIVITY RATE VARIATIONS
  async fetchActivityRateVariations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { activityRateId, take = 10, skip = 0 } = req.query;
      let condition: object = {};

      // IF ACTIVITY RATE ID PROVIDED
      if (activityRateId) {
        condition = { ...condition, activityRateId: activityRateId };
      }

      // FETCH ACTIVITY RATE VARIATIONS
      const activityRateVariations =
        await activityRateVariationService.fetchActivityRateVariations({
          take: Number(take),
          skip: Number(skip),
          condition,
        });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Activity rate variations fetched successfully!',
        data: activityRateVariations,
      });
    } catch (error) {
      next(error);
    }
  },

  // FETCH ACTIVITY RATE VARIATION
  async getActivityRateVariationById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      // FETCH ACTIVITY RATE VARIATION
      const activityRateVariation =
        await activityRateVariationService.getActivityRateVariationDetails(
          id as UUID
        );

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Activity rate variation returned successfully!',
        data: activityRateVariation,
      });
    } catch (error) {
      next(error);
    }
  },

  // UPDATE ACTIVITY RATE VARIATION
  async updateActivityRateVariation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const {
        name,
        amountUsd,
        amountRwf,
        description,
        disclaimer,
        activityRateId,
      } = req.body;

      // UPDATE ACTIVITY RATE VARIATION
      const updatedActivityRateVariation =
        await activityRateVariationService.updateActivityRateVariation({
          id: id as UUID,
          name,
          amountUsd,
          amountRwf,
          description,
          disclaimer,
          activityRateId,
        });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Activity rate variation updated successfully!',
        data: updatedActivityRateVariation,
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE ACTIVITY RATE VARIATION
  async deleteActivityRateVariation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      // DELETE ACTIVITY RATE VARIATION
      await activityRateVariationService.deleteActivityRateVariation(id as UUID);

      // RETURN RESPONSE
      return res.status(204).json({
        message: 'Activity rate variation deleted successfully!',
      });
    } catch (error) {
      next(error);
    }
  },
};
