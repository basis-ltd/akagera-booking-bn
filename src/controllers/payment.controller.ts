import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';
import { UUID } from 'crypto';

// INITIALIZE PAYMENT SERVICE
const paymentService = new PaymentService();

// LOAD ENVIROMENT VARIABLES
const { STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, APPLICATION_LINK } =
  process.env;

export const PaymentController = {
  // CREATE PAYMENT
  async createPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { amount, currency = 'RWF', bookingId, email } = req.body;

      // CREATE PAYMENT
      const newPayment = await paymentService.createPayment({
        email,
        amount,
        currency,
        bookingId,
      });

      // RETURN RESPONSE
      return res.status(201).json({
        message: 'Payment created successfully!',
        data: {
          payment: newPayment,
          stripeKeys: {
            publishableKey: STRIPE_PUBLISHABLE_KEY,
            secretKey: STRIPE_SECRET_KEY,
          },
          applicationLink: APPLICATION_LINK,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // FETCH PAYMENTS
  async fetchPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId, email, page = 0, size = 10, status } = req.query;
      const condition: object = {
        bookingId,
        email,
        status,
      };

      // FETCH PAYMENTS
      const payments = await paymentService.fetchPayments({
        condition,
        page: Number(page),
        size: Number(size),
      });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Payments fetched successfully!',
        data: payments,
      });
    } catch (error) {
      next(error);
    }
  },

  // CONFIRM PAYMENT
  async confirmPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // CONFIRM PAYMENT
      const confirmedPayment = await paymentService.confirmPayment({
        id: id as UUID,
      });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Payment confirmed successfully!',
        data: confirmedPayment,
      });
    } catch (error) {
      next(error);
    }
  },

  // PAYMENT CALLBACK
  async paymentCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const { CompanyRef, TransID, CCDapproval } = req.query;
      const { status = 'PAID' } = req.body;

      // UPDATE PAYMENT
      const updatedPayment = await paymentService.updatePayment({
        id: CompanyRef as UUID,
        status,
        transactionId: TransID as string,
        approvalCode: CCDapproval as string,
      });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Payment updated successfully!',
        data: updatedPayment,
      });
    } catch (error) {
      next(error);
    }
  },
};
