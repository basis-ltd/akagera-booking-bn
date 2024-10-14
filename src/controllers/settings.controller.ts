import { Request, Response, NextFunction } from 'express';
import { SettingsService } from '../services/settings.service';
import { AuthenticatedRequest } from '../types/auth.types';
import { UUID } from 'crypto';

// INITIALIZE SETTINGS SERVICE
const settingsService = new SettingsService();

export const SettingsController = {
  // FETCH SETTINGS
  async fetchSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await settingsService.fetchSettings();

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Settings fetched successfully!',
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  },
  // SET USD RATE
  async setUsdRate(req: Request, res: Response, next: NextFunction) {
    try {
      const { usdRate } = req.body;

      const { user } = req as AuthenticatedRequest;

      // SET USD RATE
      const updatedUsdRate = await settingsService.setUsdRate({ usdRate, userId: user?.id });

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

  // UPDATE ADMIN EMAIL
  async updateAdminEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const { user } = req as AuthenticatedRequest;

      // UPDATE ADMIN EMAIL
      const updatedAdminEmail = await settingsService.updateAdminEmail({ adminEmail: email, userId: user?.id });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Admin email updated successfully!',
        data: updatedAdminEmail,
      });
    } catch (error) {
      next(error);
    }
  },

  // FETCH USD RATE HISTORY
  async fetchUsdRateHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as AuthenticatedRequest;

      const usdRateHistory = await settingsService.fetchUsdRateHistory({ userId: user?.id });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'USD rate history fetched successfully!',
        data: usdRateHistory,
      });
    } catch (error) {
      next(error);
    }
  },

  // FETCH ADMIN EMAIL HISTORY
  async fetchAdminEmailHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as AuthenticatedRequest;

      const adminEmailHistory = await settingsService.fetchAdminEmailHistory({ userId: user?.id });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Admin email history fetched successfully!',
        data: adminEmailHistory,
      });
    } catch (error) {
      next(error);
    }
  },

  // UPDATE SETTINGS
  async updateSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { usdRate, adminEmail } = req.body;
      const { user } = req as AuthenticatedRequest;

      const updatedSettings = await settingsService.updateSettings({
        userId: user?.id,
        id: id as UUID,
        usdRate,
        adminEmail,
      });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Settings updated successfully!',
        data: updatedSettings,
      });
    } catch (error) {
      next(error);
    }
  },
};
