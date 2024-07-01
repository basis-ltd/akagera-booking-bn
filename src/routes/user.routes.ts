import { Router } from "express";
import { UserController } from "../controllers/user.controller";

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

// EXPORT ROUTER
export default router;
