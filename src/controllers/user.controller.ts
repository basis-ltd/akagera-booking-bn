import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { UUID } from 'crypto';
import { ValidationError } from '../helpers/errors.helper';

// INITIALIZE USER SERVICE
const userService = new UserService();

export const UserController = {
  // CREATE USER
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        name,
        email,
        phone,
        role = 'receptionist',
        nationality = 'RW',
      } = req.body;

      // CREATE USER
      const newUser = await userService.createUser({
        name,
        phone,
        role,
        email,
        nationality,
      });

      // RETURN RESPONSE
      return res.status(201).json({
        message: 'User created successfully',
        data: newUser,
      });
    } catch (error) {
      next(error);
    }
  },

  // UPDATE USER
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, gender, phone, role } = req.body;

      // VALIDATE GENDER
      if (!['M', 'F'].includes(gender)) {
        throw new ValidationError('Invalid value for gender');
      }

      // UPDATE USER
      const updatedUser = await userService.updateUser({
        id: id as UUID,
        name,
        phone,
        role,
        gender,
      });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'User updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  },

  // FETCH USERS
  async fetchUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { size = 10, page = 0, role, nationality } = req.query;
      let condition: object = {
        role,
        nationality,
      };

      const usersList = await userService.fetchUsers({
        size: Number(size),
        page: Number(page),
        condition,
      });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Users returned successfully',
        data: usersList,
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE USER
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // DELETE USER
      await userService.deleteUser(id as UUID)

      // RETURN RESPONSE
      return res.status(204).json({
        message: 'User deleted successfully'
      })
    } catch (error) {
      next(error)
    }
  },

  // UPDATE USER PASSWORD
  async updateUserPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { existingPassword, newPassword } = req.body;

      // UPDATE USER PASSWORD
      await userService.updateUserPassword({
        id: id as UUID,
        existingPassword,
        newPassword,
      });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Password updated successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  // GET USER PROFILE
  async getUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // FETCH USER PROFILE
      const userProfile = await userService.getUserById(id as UUID);

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'User profile returned successfully',
        data: userProfile,
      });
    } catch (error) {
      next(error);
    }
  },

  // UPDATE USER PHOTO
  async updateUserPhoto(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { file } = req;

      // UPDATE USER PHOTO
      const updatedUser = await userService.updateUserPhoto({
        id: id as UUID,
        file: file as Express.Multer.File,
      });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'User photo updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  },
};
