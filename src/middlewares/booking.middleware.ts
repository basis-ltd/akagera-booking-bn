import jwt, { JwtPayload } from 'jsonwebtoken';
import { Booking } from '../entities/booking.entity';
import { NextFunction, Request, Response } from 'express';

export interface BookingAuthenticationRequest extends Request {
  booking: Booking | JwtPayload | undefined;
}

export const bookingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.query;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(String(token), process.env.JWT_SECRET!);

    (req as BookingAuthenticationRequest).booking = decoded as
      | Booking
      | JwtPayload
      | undefined;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
