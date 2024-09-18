import { Request, Response, NextFunction } from 'express';
import { SettingsService } from '../services/settings.service';

// INITIALIZE SETTINGS SERVICE
const settingsService = new SettingsService();

export const SettingsController = {
  // SET USD RATE
  async setUsdRate(req: Request, res: Response, next: NextFunction) {
    try {
      const { usdRate } = req.body;

      // SET USD RATE
      const updatedUsdRate = await settingsService.setUsdRate({ usdRate });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'USD rate set successfully!',
        data: updatedUsdRate,
      });
    } catch (error) {
      next(error);
    }
  },

  // GET USD RATE
  async getUsdRate(req: Request, res: Response, next: NextFunction) {
    try {
      // GET USD RATE
      const usdRate = await settingsService.getUsdRate();

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'USD rate fetched successfully!',
        data: usdRate,
      });
    } catch (error) {
      next(error);
    }
  },
};
