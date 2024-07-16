import { Request, Response, NextFunction } from 'express';
import { BookingPersonService } from '../services/bookingPerson.service';
import { UUID } from 'crypto';
import { Between } from 'typeorm';
import moment from 'moment';

// INITIALIZE BOOKING PERSON SERVICE
const bookingPersonService = new BookingPersonService();

export const BookingPersonController = {
  // CREATE BOOKING PERSON
  async createBookingPerson(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        name,
        nationality,
        dateOfBirth,
        gender = 'M',
        residence = nationality,
        bookingId,
        startDate,
        endDate,
        accomodation,
        email,
        phone
      } = req.body;
      
      // CREATE BOOKING PERSON
      const newBookingPerson = await bookingPersonService.createBookingPerson({
        name,
        nationality,
        dateOfBirth,
        gender,
        residence,
        bookingId,
        startDate,
        endDate,
        accomodation,
        email,
        phone
      });

      // RETURN RESPONSE
      return res.status(201).json({
        message: 'Booking person created successfully!',
        data: newBookingPerson,
      });
    } catch (error) {
      next(error);
    }
  },

  // FETCH BOOKING PEOPLE
  async fetchBookingPeople(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId, size = 10, page = 0 } = req.query;
      let condition: object = {};

      // ADD BOOKING ID TO CONDITION
      condition = { ...condition, bookingId };

      // FETCH BOOKING PEOPLE
      const bookingPeople = await bookingPersonService.fetchBookingPeople({
        condition: { bookingId },
        size: Number(size),
        page: Number(page),
      });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Booking people fetched successfully!',
        data: bookingPeople,
      });
    } catch (error) {
      next(error);
    }
  },

  // FETCH POPULAR BOOKING PEOPLE 
  async fetchPopularBookingPeople(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { size = 10, page = 0, criteria = 'residence' } = req.query;

      // FETCH POPULAR BOOKING PEOPLE
      const popularBookingPeople =
        await bookingPersonService.fetchPopularBookingPeople({
          size: Number(size),
          page: Number(page),
          criteria: criteria as 'residence' | 'nationality' | 'dateOfBirth',
        });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Popular booking people fetched successfully!',
        data: popularBookingPeople,
      });
    } catch (error) {
      next(error);
    }
  },

  // GET BOOKING PERSON DETAILS
  async getBookingPersonDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      // GET BOOKING PERSON DETAILS
      const bookingPerson = await bookingPersonService.getBookingPersonDetails(
        id as UUID
      );

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Booking person details fetched successfully!',
        data: bookingPerson,
      });
    } catch (error) {
      next(error);
    }
  },

  // UPDATE BOOKING PERSON
  async updateBookingPerson(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, dateOfBirth, nationality, residence, phone, email } =
        req.body;

      // UPDATE BOOKING PERSON
      const updatedBookingPerson =
        await bookingPersonService.updateBookingPerson({
          id: id as UUID,
          name,
          dateOfBirth,
          nationality,
          residence,
          phone,
          email,
        });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Booking person updated successfully!',
        data: updatedBookingPerson,
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE BOOKING PERSON
  async deleteBookingPerson(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // DELETE BOOKING PERSON
      await bookingPersonService.deleteBookingPerson(id as UUID);

      // RETURN RESPONSE
      return res.status(204).json({
        message: 'Booking person deleted successfully!',
      });
    } catch (error) {
      next(error);
    }
  },

  // FETCH BOOKING PEOPLE STATS
  async fetchBookingPeopleStats(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { month, size = 5000, page = 0 } = req.query;
      const condition = {
        startDate: Between(
          moment(String(month)).startOf('month').format(),
          moment(String(month)).endOf('month').format()
        ),
      };

      // FETCH BOOKING PEOPLE STATS
      const bookingPeopleStats =
        await bookingPersonService.fetchBookingPeopleStats({
          condition,
          size: Number(size),
          page: Number(page),
        });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Booking people stats fetched successfully!',
        data: bookingPeopleStats,
      });
    } catch (error) {
      next(error);
    }
  },
};
