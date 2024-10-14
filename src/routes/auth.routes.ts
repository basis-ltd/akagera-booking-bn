import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import errorHandler from '../middlewares/errors.middleware';
import { authMiddleware, resetPasswordMiddleware } from '../middlewares/auth.middleware';

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
router.post('/request-login-otp', AuthController.requestLoginOTP);

// RESET PASSWORD
router.post('/request-password-reset', AuthController.requestResetPassword);

// VERIFY OTP
router.post('/verify-password-reset', AuthController.verifyPasswordReset);

// RESET PASSWORD
router.post('/reset-password', resetPasswordMiddleware, AuthController.resetPassword);

// EXPORT ROUTER
export default router;
