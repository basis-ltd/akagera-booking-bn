import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import errorHandler from '../middlewares/errors.middleware';

// CREATE ROUTER
const router = Router();

/**
 * ROUTES
 */

// SIGNUP
router.post('/signup', AuthController.signup);

// LOGIN
router.post('/login', AuthController.login);

// VERIFY
router.post('/verify', AuthController.verifyAuth);

// REQUEST OTP
router.post('/request-otp', AuthController.requestOTP);

// EXPORT ROUTER
export default router;
