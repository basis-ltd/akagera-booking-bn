import { Request, Response, NextFunction } from 'express';
import { BookingActivityService } from '../services/bookingActivity.service';
import { UUID } from 'crypto';
import { BookingActivityPersonService } from '../services/bookingActivityPerson.service';
import { Between, In } from 'typeorm';
import moment from 'moment';

// INITIALIZE BOOKING ACTIVITY SERVICE
const bookingActivityService = new BookingActivityService();
const bookingActivityPersonService = new BookingActivityPersonService();

export const BookingActivityController = {
  // CREATE BOOKING ACTIVITY
  async createBookingActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        startTime,
        endTime,
        bookingId,
        activityId,
        numberOfAdults = 0,
        numberOfChildren = 0,
        bookingActivityPeople,
        numberOfSeats = 0,
        defaultRate,
      } = req.body;

      // CREATE BOOKING ACTIVITY
      const newBookingActivity =
        await bookingActivityService.createBookingActivity({
          startTime,
          endTime,
          bookingId,
          activityId,
          numberOfAdults,
          numberOfChildren,
          numberOfSeats,
          defaultRate,
        });

      // IF BOOKING ACTIVITY PEOPLE PROVIDED
      let newBookingActivityPeople: any = [];
      if (bookingActivityPeople?.length > 0) {
        // CREATE BOOKING ACTIVITY PEOPLE
        newBookingActivityPeople =
          await bookingActivityPersonService.createBookingActivityPerson({
            bookingActivityPeople: bookingActivityPeople?.map(
              (bookingActivityPerson: any) => {
                return {
                  bookingActivityId: newBookingActivity?.id,
                  bookingPersonId: bookingActivityPerson.bookingPersonId,
                };
              }
            ),
          });
      }

      // RETURN RESPONSE
      return res.status(201).json({
        message: 'Booking activity created successfully!',
        data: {
          bookingActivity: newBookingActivity,
          bookingActivityPeople: newBookingActivityPeople,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // FETCH BOOKING ACTIVITIES
  async fetchBookingActivities(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        bookingId,
        size = 10,
        page = 0,
        activityId,
        startTime,
      } = req.query;
      let condition: object = {
        bookingId,
        activityId,
        startTime:
          startTime &&
          Between(
            moment(String(startTime)).startOf('day').format(),
            String(moment(String(startTime)).add(1, 'day').format())
          ),
      };

      // FETCH BOOKING ACTIVITIES
      const bookingActivities =
        await bookingActivityService.fetchBookingActivities({
          condition,
          size: Number(size),
          page: Number(page),
        });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Booking activities fetched successfully!',
        data: bookingActivities,
      });
    } catch (error) {
      next(error);
    }
  },

  // FETCH POPULAR ACTIVITIES
  async fetchPopularActivities(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        size = 10,
        page = 0,
        startDate = moment().startOf('M'),
        endDate = moment((startDate as string) || new Date()).endOf('M'),
        type
      } = req.query;
      // FETCH POPULAR ACTIVITIES
      const popularActivities =
        await bookingActivityService.fetchPopularActivities({
          size: Number(size),
          page: Number(page),
          startDate: startDate ? (startDate as unknown as Date) : undefined,
          endDate: endDate ? (endDate as unknown as Date) : undefined,
          type: type ? type  as 'booking' | 'registration' : 'booking'
        });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Popular activities fetched successfully!',
        data: popularActivities,
      });
    } catch (error) {
      next(error);
    }
  },

  // GET BOOKING ACTIVITY BY ID
  async getBookingActivityById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      // GET BOOKING ACTIVITY BY ID
      const bookingActivity =
        await bookingActivityService.getBookingActivityDetails(id as UUID);

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Booking activity fetched successfully!',
        data: bookingActivity,
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE BOOKING ACTIVITY
  async deleteBookingActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // DELETE BOOKING ACTIVITY
      await bookingActivityService.deleteBookingActivity(id as UUID);

      // RETURN RESPONSE
      return res.status(204).json({
        message: 'Booking activity deleted successfully!',
      });
    } catch (error) {
      next(error);
    }
  },

  // UPDATE BOOKING ACTIVITY
  async updateBookingActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const {
        startTime,
        endTime,
        activityId,
        numberOfAdults,
        numberOfChildren,
        numberOfSeats,
        defaultRate,
      } = req.body;

      // UPDATE BOOKING ACTIVITY
      const updatedBookingActivity =
        await bookingActivityService.updateBookingActivity({
          id: id as UUID,
          startTime,
          endTime,
          activityId,
          numberOfAdults,
          numberOfChildren,
          numberOfSeats,
          defaultRate,
        });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Booking activity updated successfully!',
        data: updatedBookingActivity,
      });
    } catch (error) {
      next(error);
    }
  },
};
