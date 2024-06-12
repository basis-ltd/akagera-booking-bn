import { Request, Response, NextFunction } from 'express';
import { BookingVehicleService } from '../services/bookingVehicle.service';
import { UUID } from 'crypto';

// INITIALIZE BOOKING VEHICLE SERVICE
const bookingVehicleService = new BookingVehicleService();

export const BookingVehicleController = {
  // CREATE BOOKING VEHICLE
  async createBookingVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId, plateNumber, vehicleType } = req.body;

      // CREATE BOOKING VEHICLE
      const newBookingVehicle =
        await bookingVehicleService.createBookingVehicle({
          bookingId,
          plateNumber,
          vehicleType,
        });

      // RETURN RESPONSE
      return res.status(201).json({
        message: 'Booking vehicle created successfully!',
        data: newBookingVehicle,
      });
    } catch (error) {
      next(error);
    }
  },

  // FETCH BOOKING VEHICLES
  async fetchBookingVehicles(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        bookingId,
        plateNumber,
        vehicleType,
        take = 10,
        skip = 0,
      } = req.query;
      let condition: object = {};
      // FETCH BOOKING VEHICLES
      const bookingVehicles = await bookingVehicleService.fetchBookingVehicles({
        condition,
        take: Number(take),
        skip: Number(skip),
      });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Booking vehicles fetched successfully!',
        data: bookingVehicles,
      });
    } catch (error) {
      next(error);
    }
  },

  // GET BOOKING VEHICLE DETAILS
  async getBookingVehicleDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      // GET BOOKING VEHICLE DETAILS
      const bookingVehicle =
        await bookingVehicleService.getBookingVehicleDetails(id as UUID);

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Booking vehicle details fetched successfully!',
        data: bookingVehicle,
      });
    } catch (error) {
      next(error);
    }
  },

  // UPDATE BOOKING VEHICLE
  async updateBookingVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { bookingId, plateNumber, vehicleType } = req.body;

      // UPDATE BOOKING VEHICLE
      const updatedBookingVehicle =
        await bookingVehicleService.updateBookingVehicle({
          id: id as UUID,
          bookingId,
          plateNumber,
          vehicleType,
        });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Booking vehicle updated successfully!',
        data: updatedBookingVehicle,
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE BOOKING VEHICLE
  async deleteBookingVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // DELETE BOOKING VEHICLE
      await bookingVehicleService.deleteBookingVehicle(id as UUID);

      // RETURN RESPONSE
      return res.status(204).json({
        message: 'Booking vehicle deleted successfully!',
      });
    } catch (error) {
      next(error);
    }
  },
};
