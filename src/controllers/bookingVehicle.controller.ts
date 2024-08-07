import { Request, Response, NextFunction } from 'express';
import { BookingVehicleService } from '../services/bookingVehicle.service';
import { UUID } from 'crypto';
import moment from 'moment';

// INITIALIZE BOOKING VEHICLE SERVICE
const bookingVehicleService = new BookingVehicleService();

export const BookingVehicleController = {
  // CREATE BOOKING VEHICLE
  async createBookingVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        bookingId,
        plateNumber,
        vehicleType,
        registrationCountry = 'RW',
        vehiclesCount = 1
      } = req.body;

      // CREATE BOOKING VEHICLE
      const newBookingVehicle =
        await bookingVehicleService.createBookingVehicle({
          bookingId,
          plateNumber,
          vehicleType,
          registrationCountry: registrationCountry?.toUpperCase(),
          vehiclesCount
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
        size = 10,
        page = 0,
      } = req.query;
      let condition: object = {
        bookingId,
        plateNumber,
        vehicleType,
      };
      // FETCH BOOKING VEHICLES
      const bookingVehicles = await bookingVehicleService.fetchBookingVehicles({
        condition,
        size: Number(size),
        page: Number(page),
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
      const {
        bookingId,
        plateNumber,
        vehicleType,
        registrationCountry = 'RW',
        vehiclesCount = 1
      } = req.body;

      // UPDATE BOOKING VEHICLE
      const updatedBookingVehicle =
        await bookingVehicleService.updateBookingVehicle({
          id: id as UUID,
          bookingId,
          plateNumber,
          vehicleType,
          registrationCountry: registrationCountry?.toUpperCase(),
          vehiclesCount
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

  // FETCH POPULAR BOOKING VEHICLES
  async fetchPopularBookingVehicles(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        registrationCountry,
        vehicleType,
        startDate = moment().startOf('month').toDate(),
        endDate = moment(startDate as string)
          .endOf('month')
          .toDate(),
      } = req.query;

      // FETCH POPULAR BOOKING VEHICLES
      const popularBookingVehicles =
        await bookingVehicleService.fetchPopularBookingVehicles({
          registrationCountry: registrationCountry as string,
          vehicleType: vehicleType as string,
          startDate: new Date(startDate as string),
          endDate: new Date(endDate as string),
        });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Popular booking vehicles fetched successfully!',
        data: popularBookingVehicles,
      });
    } catch (error) {
      next(error);
    }
  },
};
