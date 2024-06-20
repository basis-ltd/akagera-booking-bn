import { Request, Response, NextFunction } from 'express';
import { BookingService } from '../services/booking.service';
import moment from 'moment';
import { UUID } from 'crypto';

// INITIALIZE BOOKING SERVICE
const bookingService = new BookingService();

export const BookingController = {
  // CREATE BOOKING
  async createBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        name,
        startDate,
        endDate,
        notes,
        email,
        phone,
        status = 'in_progress',
        totalAmountRwf,
        totalAmountUsd,
        discountedAmountRwf,
        discountedAmountUsd,
      } = req.body;

      // CREATE BOOKING
      const newBooking = await bookingService.createBooking({
        name,
        startDate,
        endDate,
        notes,
        email,
        phone,
        status,
        totalAmountRwf,
        totalAmountUsd,
        discountedAmountRwf,
        discountedAmountUsd,
      });

      // RETURN RESPONSE
      return res.status(201).json({
        message: 'Booking created successfully!',
        data: newBooking,
      });
    } catch (error) {
      next(error);
    }
  },

  // FETCH BOOKINGS
  async fetchBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        startDate,
        endDate,
        take = 10,
        skip = 0,
        referenceId,
        email, phone,
        approvedBy,
        approvedAt,
        status,
        name
      } = req.query;
      let condition: object = {
        startDate: startDate && moment(String(startDate)).format('YYYY-MM-DD'),
        endDate: endDate && moment(String(endDate)).format('YYYY-MM-DD'),
        referenceId,
        email, phone,
        approvedBy,
        approvedAt,
        status,
        name
      };

      // FETCH BOOKINGS
      const bookings = await bookingService.fetchBookings({
        take: Number(take),
        skip: Number(skip),
        condition,
      });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Bookings fetched successfully!',
        data: bookings,
      });
    } catch (error) {
      next(error);
    }
  },

  // UPDATE BOOKING
  async updateBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const {
        name,
        startDate,
        endDate,
        notes,
        email, phone,
        approvedAt,
        status,
        totalAmountRwf,
        totalAmountUsd,
        discountedAmountRwf,
        discountedAmountUsd,
      } = req.body;

      // UPDATE BOOKING
      const updatedBooking = await bookingService.updateBooking({
        id: id as UUID,
        name,
        startDate,
        endDate,
        notes,
        email, phone,
        approvedAt,
        status,
        totalAmountRwf,
        totalAmountUsd,
        discountedAmountRwf,
        discountedAmountUsd,
      });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Booking updated successfully!',
        data: updatedBooking,
      });
    } catch (error) {
      next(error);
    }
  },

  // GET BOOKING BY ID
  async getBookingById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { referenceId } = req.query;

      if (referenceId) {
        // FETCH BOOKING
        const booking = await bookingService.getBookingDetailsByReferenceId(
          String(referenceId)
        );

        // RETURN RESPONSE
        return res.status(200).json({
          message: 'Booking fetched successfully!',
          data: booking,
        });
      }

      // FETCH BOOKING
      const booking = await bookingService.getBookingDetails(id as UUID);

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Booking fetched successfully!',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE BOOKING
  async deleteBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // DELETE BOOKING
      await bookingService.deleteBooking(id as UUID);

      // RETURN RESPONSE
      return res.status(204).json({
        message: 'Booking deleted successfully!',
      });
    } catch (error) {
      next(error);
    }
  },

  // FETCH BOOKING STATUSES
  async fetchBookingStatuses(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        startDate,
        endDate,
        email,
        phone,
        approvedBy,
        approvedAt,
        status,
      } = req.query;
      let condition: object = {
        startDate: startDate && moment(String(startDate)).format('YYYY-MM-DD'),
        endDate: endDate && moment(String(endDate)).format('YYYY-MM-DD'),
        email,
        phone,
        approvedBy,
        approvedAt,
        status,
      };
      // FETCH BOOKING STATUSES
      const bookingStatuses = await bookingService.fetchBookingStatuses({
        condition,
      });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Booking statuses fetched successfully!',
        data: bookingStatuses,
      });
    } catch (error) {
      next(error);
    }
  },
};
