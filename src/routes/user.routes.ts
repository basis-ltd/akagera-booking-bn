import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import multer from 'multer';
import {
  adminMiddleware,
  authMiddleware,
} from '../middlewares/auth.middleware';

// CREATE ROUTER
const router = Router();

/**
 * ROUTES
 */

// CREATE USER
router.post('/', authMiddleware, adminMiddleware, UserController.createUser);

// UPDATE USER
router.patch('/:id', authMiddleware, UserController.updateUser);

// FETCH USERS
router.get('/', authMiddleware, adminMiddleware, UserController.fetchUsers);

// GET USER PROFILE
router.get('/:id', authMiddleware, UserController.getUserProfile);

// DELETE USER
router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  UserController.deleteUser
);

// UPDATE USER PASSWORD
router.patch(
  '/:id/password',
  authMiddleware,
  UserController.updateUserPassword
);

// UPDATE USER PHOTO
router.patch(
  '/:id/photo',
  authMiddleware,
  multer().single('file'),
  UserController.updateUserPhoto
);

// EXPORT ROUTER
export default router;
