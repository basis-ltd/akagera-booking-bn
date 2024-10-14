import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

// CREATE ROUTER
const router = Router();

/**
 * ROUTES
 */

// CREATE PAYMENT
router.post('/', PaymentController.createPayment);

// FETCH PAYMENTS
router.get('/', PaymentController.fetchPayments);

// UPDATE PAYMENT
router.patch('/', PaymentController.paymentCallback);

// CONFIRM PAYMENT
router.patch('/:id/confirm', authMiddleware, PaymentController.confirmPayment);

// PAYMENT CALLBACK
router.post('/callback', PaymentController.paymentCallback);

// EXPORT ROUTER
export default router;
