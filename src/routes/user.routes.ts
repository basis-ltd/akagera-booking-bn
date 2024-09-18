import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import multer from 'multer';

// CREATE ROUTER
const router = Router();

/**
 * ROUTES
 */

// CREATE USER
router.post('/', UserController.createUser);

// UPDATE USER
router.patch('/:id', UserController.updateUser)

// FETCH USERS
router.get('/', UserController.fetchUsers)

// GET USER PROFILE
router.get('/:id', UserController.getUserProfile)

// DELETE USER
router.delete('/:id', UserController.deleteUser)

// UPDATE USER PASSWORD
router.patch('/:id/password', UserController.updateUserPassword)

// UPDATE USER PHOTO
router.patch('/:id/photo', multer().single('file'), UserController.updateUserPhoto)

// EXPORT ROUTER
export default router;
