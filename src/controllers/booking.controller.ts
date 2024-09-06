import { Request, Response, NextFunction } from 'express';
import { BookingService } from '../services/booking.service';
import moment from 'moment';
import { UUID } from 'crypto';
import { LessThanOrEqual } from 'typeorm';

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
        accomodation,
        exitGate,
        entryGate,
        type,
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
        accomodation,
        exitGate,
        entryGate,
        type,
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
        size = 10,
        page = 0,
        referenceId,
        email,
        phone,
        approvedBy,
        approvedAt,
        status,
        name,
        entryGate,
        type,
        exitGate,
      } = req.query;
      let condition: object = {
        startDate,
        endDate,
        referenceId,
        email,
        phone,
        approvedBy,
        approvedAt,
        status,
        name,
        entryGate,
        type,
        exitGate,
      };

      // FETCH BOOKINGS
      const bookings = await bookingService.fetchBookings({
        size: Number(size),
        page: Number(page),
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

  // FETCH TIME SERIES BOOKINGS
  async fetchTimeSeriesBookings(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        startDate = moment().startOf('M'),
        endDate = moment((startDate as string) || new Date()).endOf('M'),
        type,
      } = req.query;

      // FETCH BOOKINGS
      const bookings = await bookingService.fetchTimeSeriesBookings({
        startDate: startDate ? (startDate as unknown as Date) : undefined,
        endDate: endDate ? (endDate as unknown as Date) : undefined,
        type: type as 'booking' | 'registration',
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
        email,
        phone,
        approvedAt,
        status,
        totalAmountRwf,
        totalAmountUsd,
        discountedAmountRwf,
        discountedAmountUsd,
        exitGate,
        entryGate,
      } = req.body;

      // UPDATE BOOKING
      const updatedBooking = await bookingService.updateBooking({
        id: id as UUID,
        name,
        startDate,
        endDate,
        notes,
        email,
        phone,
        approvedAt,
        status,
        totalAmountRwf,
        totalAmountUsd,
        discountedAmountRwf,
        discountedAmountUsd,
        exitGate,
        entryGate,
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

  // CONFIRM CREATE BOOKING
  async submitBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const {
        status = 'pending_contact',
        totalAmountRwf,
        totalAmountUsd,
      } = req.body;

      // CONFIRM BOOKING
      const confirmedBooking = await bookingService.submitBooking({
        id: id as UUID,
        status,
        totalAmountRwf,
        totalAmountUsd,
      });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Booking confirmed successfully!',
        data: confirmedBooking,
      });
    } catch (error) {
      next(error);
    }
  },

  // UPDATE BOOKING CONSENT
  async updateBookingConsent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { consent } = req.body;

      // UPDATE BOOKING CONSENT
      const updatedBooking = await bookingService.updateBookingConsent({
        id: id as UUID,
        consent,
      });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Booking consent updated successfully!',
        data: updatedBooking,
      });
    } catch (error) {
      next(error);
    }
  },

  // CALCUATE BOOKING AMOUNT
  async calculateBookingAmount(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      // CALCULATE BOOKING AMOUNT
      const bookingAmount = await bookingService.calculateBookingAmount({
        id: id as UUID,
      });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Booking amount calculated successfully!',
        data: bookingAmount,
      });
    } catch (error) {
      next(error);
    }
  },

  // DOWNLOAD BOOKING CONSENT
  async downloadBookingConsent(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      // DOWNLOAD BOOKING CONSENT
      const consent = await bookingService.downloadBookingConsent({
        id: id as UUID,
      });

      // Set response headers for file download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="booking_consent.pdf"`
      );

      // Send the PDF buffer as the response
      res.send(consent);
    } catch (error) {
      next(error);
    }
  },
};
