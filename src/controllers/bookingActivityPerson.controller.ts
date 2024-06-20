import { Request, Response, NextFunction } from 'express';
import { BookingActivityPersonService } from '../services/bookingActivityPerson.service';
import { UUID } from 'crypto';

// INITIALIZE BOOKING ACTIVITY PERSON SERVICE
const bookingActivityPersonService = new BookingActivityPersonService();

export const BookingActivityPersonController = {
  // CREATE BOOKING ACTIVITY PERSON
  async createBookingActivityPerson(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { bookingActivityPeople } = req.body;

      // CREATE BOOKING ACTIVITY PERSON
      const newBookingActivityPeople =
        await bookingActivityPersonService.createBookingActivityPerson({
          bookingActivityPeople,
        });

      // RETURN RESPONSE
      return res.status(201).json({
        message: 'Booking activity people created successfully!',
        data: newBookingActivityPeople,
      });
    } catch (error) {
      next(error);
    }
  },

  // FETCH BOOKING ACTIVITY PEOPLE
  async fetchBookingActivityPeople(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { take = 10, skip = 0, bookingActivityId } = req.query;
      let condition: object = {
        bookingActivityId,
      };

      // FETCH BOOKING ACTIVITY PEOPLE
      const bookingActivityPeople =
        await bookingActivityPersonService.fetchBookingActivityPeople({
          condition,
          take: Number(take),
          skip: Number(skip),
        });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Booking activity people fetched successfully!',
        data: bookingActivityPeople,
      });
    } catch (error) {
      next(error);
    }
  },

  // GET BOOKING ACTIVITY PERSON DETAILS
  async getBookingActivityPersonDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      // GET BOOKING ACTIVITY PERSON DETAILS
      const bookingActivityPerson =
        await bookingActivityPersonService.getBookingActivityPersonDetails(
          id as UUID
        );

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Booking activity person fetched successfully!',
        data: bookingActivityPerson,
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE BOOKING ACTIVITY PERSON
  async deleteBookingActivityPerson(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      // DELETE BOOKING ACTIVITY PERSON
      await bookingActivityPersonService.deleteBookingActivityPerson(id as UUID);

      // RETURN RESPONSE
      return res.status(204).json({
        message: 'Booking activity person deleted successfully!',
      });
    } catch (error) {
      next(error);
    }
  },
};
