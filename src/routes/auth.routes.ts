import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

// CREATE ROUTER
const router = Router();

/**
 * ROUTES
 */

// SIGNUP
router.post('/signup', AuthController.signup);

// LOGIN
router.post('/login', AuthController.login);

// EXPORT ROUTER
export default router;
