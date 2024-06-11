import { Request, Response, NextFunction } from "express";
import { BookingActivityService } from "../services/bookingActivity.service";
import { UUID } from "crypto";

// INITIALIZE BOOKING ACTIVITY SERVICE
const bookingActivityService = new BookingActivityService();

export const BookingActivityController = {
  // CREATE BOOKING ACTIVITY
  async createBookingActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const { startTime, endTime, bookingId, activityId } = req.body;

      // CREATE BOOKING ACTIVITY
      const newBookingActivity =
        await bookingActivityService.createBookingActivity({
          startTime,
          endTime,
          bookingId,
          activityId,
        });

      // RETURN RESPONSE
      return res.status(201).json({
        message: 'Booking activity created successfully!',
        data: newBookingActivity,
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
      const { bookingId, take = 10, skip = 0, activityId } = req.query;
      let condition: object = {};

      // IF BOOKING ID PROVIDED
      if (bookingId) {
        condition = { ...condition, bookingId, activityId };
      }

      // FETCH BOOKING ACTIVITIES
      const bookingActivities =
        await bookingActivityService.fetchBookingActivities({
          condition,
          take: Number(take),
          skip: Number(skip),
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
      const { startTime, endTime, bookingId, activityId } = req.body;

      // UPDATE BOOKING ACTIVITY
      const updatedBookingActivity =
        await bookingActivityService.updateBookingActivity({
          id: id as UUID,
          startTime,
          endTime,
          bookingId,
          activityId,
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