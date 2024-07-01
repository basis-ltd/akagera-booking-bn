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
      const { take = 10, skip = 0, role, nationality } = req.query;
      let condition: object = {
        role,
        nationality,
      };

      const usersList = await userService.fetchUsers({
        take: Number(take),
        skip: Number(skip),
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
};
