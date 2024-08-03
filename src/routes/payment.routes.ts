import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";

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
router.patch('/', PaymentController.updatePayment);

// CONFIRM PAYMENT
router.patch('/:id/confirm', PaymentController.confirmPayment);

// EXPORT ROUTER
export default router;
