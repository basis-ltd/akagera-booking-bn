import { Request, Response, NextFunction } from 'express';
import { TermsService } from '../services/terms.service';
import { UUID } from 'crypto';

// INITIALIZE TERMS SERVICE
const termsService = new TermsService();

export const TermsController = {
  // GET TERMS OF SERVICE
  async getTermsOfService(req: Request, res: Response, next: NextFunction) {
    try {
      // GET TERMS OF SERVICE
      const terms = await termsService.getTermsOfService();

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Terms of service fetched successfully!',
        data: terms,
      });
    } catch (error: any) {
      next(error);
    }
  },

  // CREATE TERMS OF SERVICE
  async createTermsOfService(req: Request, res: Response, next: NextFunction) {
    try {
      const { termsOfService } = req.body;
      // CREATE TERMS OF SERVICE
      const terms = await termsService.createTermsOfService({ termsOfService });

      // RETURN RESPONSE
      return res.status(201).json({
        message: 'Terms of service created successfully!',
        data: terms,
      });
    } catch (error: any) {
      next(error);
    }
  },

  // UPDATE TERMS OF SERVICE
  async updateTermsOfService(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { termsOfService } = req.body;
      // UPDATE TERMS OF SERVICE
      const terms = await termsService.updateTermsOfService({ id: id as UUID, termsOfService });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Terms of service updated successfully!',
        data: terms,
      });
    } catch (error: any) {
      next(error);
    }
  },
};
