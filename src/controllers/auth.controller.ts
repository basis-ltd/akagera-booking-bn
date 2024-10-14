import { Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { ConflictError } from '../helpers/errors.helper';
import { AuthenticatedRequest } from '../types/auth.types';

// INITIALIZE USER AND AUTH SERVICES
const authService = new AuthService();
const userService = new UserService();

// LOAD ENVIROMENT VARIABLES
const { JWT_SECRET } = process.env;

export const AuthController = {
  // SIGNUP
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, name, phone, password, role } = req.body;

      // CHECK IF USER EXISTS
      const userExists = await userService.findUserByEmail(email);

      if (userExists) {
        throw new ConflictError('User already exists', {
          id: userExists.id,
        });
      }

      // CREATE USER
      const newUser = await authService.signup({
        email,
        name,
        phone,
        password,
        role,
      });

      // CREATE TOKEN
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role },
        JWT_SECRET!,
        {
          expiresIn: '1d',
        }
      );

      // RETURN RESPONSE
      return res.status(201).json({
        message: 'You have signed up successfully!',
        data: {
          user: {
            ...newUser,
            password: undefined,
          },
          token,
        },
      });
    } catch (error: any) {
      next(error);
    }
  },

  // LOGIN
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      // LOGIN
      const user = await authService.login({ email, password });

      if (user?.role === 'admin') {
        return res.status(202).json({
          message: 'Please check your email for OTP',
        });
      }

      // CREATE TOKEN
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET!,
        {
          expiresIn: '1w',
        }
      );

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'You have logged in successfully!',
        data: {
          user: {
            ...user,
            password: undefined,
          },
          token,
        },
      });
    } catch (error: any) {
      next(error);
    }
  },

  // VERIFY LOGIN
  async verifyAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;

      // VERIFY
      const user = await authService.verifyAuth({ email, otp });

      // CREATE TOKEN
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET!,
        {
          expiresIn: '1w',
        }
      );

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'You have logged in successfully!',
        data: {
          user: {
            ...user,
            password: undefined,
          },
          token,
        },
      });
    } catch (error: any) {
      next(error);
    }
  },

  // REQUEST OTP
  async requestLoginOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      // REQUEST OTP
      await authService.requestLoginOTP({ email });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'OTP has been sent to your email',
      });
    } catch (error: any) {
      next(error);
    }
  },

  // RESET PASSWORD
  async requestResetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      // REQUEST RESET PASSWORD
      await authService.requestResetPassword({ email });


      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Reset password email has been sent to your email',
      });
    } catch (error: any) {
      next(error);
    }
  },

  // VERIFY PASSWORD RESET
  async verifyPasswordReset(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;

      // VERIFY PASSWORD RESET
      const { token } = await authService.verifyPasswordReset({ email, otp });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'OTP has been verified successfully',
        data: {
          token,
        },
      });
    } catch (error: any) {
      next(error);
    }
  },

  // RESET PASSWORD
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { password } = req.body;
      const { user } = req as AuthenticatedRequest;

      // RESET PASSWORD
      await authService.resetPassword({ email: user?.email, password });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Password has been reset successfully',
      });
    } catch (error: any) {
      next(error);
    }
  },
};
