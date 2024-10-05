import { Request, Response, NextFunction } from 'express';
import { LogsService } from '../services/logs.service';

// INITIALIZE LOGS SERVICE
const logsService = new LogsService();

export const LogsController = {
  // FETCH ACTIVITIES LOGS
  async fetchActivitiesLogs(req: Request, res: Response, next: NextFunction) {
    try {
      // FETCH ACTIVITIES LOGS
      const logData = await logsService.fetchActivitiesLogs();

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Activities logs fetched successfully!',
        data: logData,
      });
    } catch (error) {
      next(error);
    }
  },

  // FETCH ERROR LOGS
    async fetchErrorLogs(req: Request, res: Response, next: NextFunction) {
        try {
        // FETCH ERROR LOGS
        const logData = await logsService.fetchErrorLogs();
    
        // RETURN RESPONSE
        return res.status(200).json({
            message: 'Error logs fetched successfully!',
            data: logData,
        });
        } catch (error) {
        next(error);
        }
    },

    // FETCH CRITICAL LOGS
    async fetchCriticalLogs(req: Request, res: Response, next: NextFunction) {
        try {
        // FETCH CRITICAL LOGS
        const logData = await logsService.fetchCriticalLogs();
    
        // RETURN RESPONSE
        return res.status(200).json({
            message: 'Critical logs fetched successfully!',
            data: logData,
        });
        } catch (error) {
        next(error);
        }
    },
};
