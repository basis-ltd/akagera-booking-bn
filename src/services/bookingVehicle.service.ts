import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { BookingVehicle } from '../entities/bookingVehicle.entity';
import { UUID } from 'crypto';
import { validateUuid } from '../helpers/validations.helper';
import { ConflictError, NotFoundError, ValidationError } from '../helpers/errors.helper';
import { BookingVehiclesPagination } from '../types/bookingVehicle.types';
import { getPagingData } from '../helpers/pagination.helper';
import { COUNTRIES } from '../constants/countries.constants';

export class BookingVehicleService {
  private bookingVehicleRepository: Repository<BookingVehicle>;

  constructor() {
    this.bookingVehicleRepository = AppDataSource.getRepository(BookingVehicle);
  }

  // CREATE BOOKING VEHICLE
  async createBookingVehicle({
    bookingId,
    plateNumber,
    vehicleType,
    registrationCountry,
    vehiclesCount
  }: {
    bookingId: UUID;
    plateNumber: string;
    vehicleType: string;
    registrationCountry: string;
    vehiclesCount: number;
  }): Promise<BookingVehicle> {
    // IF NO BOOKING ID
    if (!bookingId) {
      throw new Error('Booking ID is required');
    }

    const { error } = validateUuid(bookingId);
    if (error) {
      throw new ValidationError('Invalid booking ID');
    }

    // IF NO VEHICLE TYPE
    if (!vehicleType) {
      throw new ValidationError('Vehicle type is required');
    }

    // VALIDATE REGISTRATION COUNTRY IF PROVIDED
    if (registrationCountry) {
      const validCountry = COUNTRIES.find(
        (country) => country.code === registrationCountry
      );

      if (!validCountry) {
        throw new ValidationError('Invalid registration country');
      }
    }

    // CREATE BOOKING VEHICLE
    const bookingVehicle = this.bookingVehicleRepository.create({
      bookingId,
      plateNumber,
      vehicleType,
      registrationCountry,
      vehiclesCount
    });

    // SAVE BOOKING VEHICLE
    await this.bookingVehicleRepository.save(bookingVehicle);

    return bookingVehicle;
  }

  // FIND BOOKING VEHICLE BY ID
  async findBookingVehicleById(id: UUID): Promise<BookingVehicle> {
    const { error } = validateUuid(id);
    if (error) {
      throw new ValidationError('Invalid booking vehicle ID');
    }

    const bookingVehicle = await this.bookingVehicleRepository.findOne({
      where: { id },
    });

    if (!bookingVehicle) {
      throw new ValidationError('Booking vehicle not found');
    }

    return bookingVehicle;
  }

  // GET BOOKING VEHICLE DETAILS
  async getBookingVehicleDetails(id: UUID): Promise<BookingVehicle> {
    const { error } = validateUuid(id);
    if (error) {
      throw new ValidationError('Invalid booking vehicle ID');
    }

    const bookingVehicle = await this.bookingVehicleRepository.findOne({
      where: { id },
      relations: {
        booking: true,
      },
    });

    if (!bookingVehicle) {
      throw new NotFoundError('Booking vehicle not found');
    }

    return bookingVehicle;
  }

  // FETCH ALL BOOKING VEHICLES
  async fetchBookingVehicles({
    take,
    skip,
    condition,
  }: {
    take: number;
    skip: number;
    condition: object;
  }): Promise<BookingVehiclesPagination> {
    const bookingVehicles = await this.bookingVehicleRepository.findAndCount({
      where: condition,
      take,
      skip,
      relations: {
        booking: true,
      },
    });

    return getPagingData(bookingVehicles, take, skip);
  }

  // UPDATE BOOKING VEHICLE
  async updateBookingVehicle({
    id,
    plateNumber,
    vehicleType,
    bookingId,
    registrationCountry,
    vehiclesCount
  }: {
    id: UUID;
    plateNumber: string;
    vehicleType: string;
    bookingId: UUID;
    registrationCountry: string;
    vehiclesCount: number;
  }): Promise<BookingVehicle> {
    const { error } = validateUuid(id);
    if (error) {
      throw new ValidationError('Invalid booking vehicle ID');
    }

    // VALIDATE REGISTRATION COUNTRY IF PROVIDED
    if (registrationCountry) {
      const validCountry = COUNTRIES.find(
        (country) => country.code === registrationCountry
      );

      if (!validCountry) {
        throw new ValidationError('Invalid registration country');
      }
    }

    const updatedBookingVehicle = await this.bookingVehicleRepository.update(
      id,
      {
        plateNumber,
        vehicleType,
        bookingId,
        vehiclesCount
      }
    );

    if (!updatedBookingVehicle.affected) {
      throw new NotFoundError('Booking vehicle not found');
    }

    return updatedBookingVehicle.raw[0];
  }

  // DELETE BOOKING VEHICLE
  async deleteBookingVehicle(id: UUID): Promise<void> {
    const { error } = validateUuid(id);
    if (error) {
      throw new ValidationError('Invalid booking vehicle ID');
    }

    const deletedBookingVehicle = await this.bookingVehicleRepository.delete(
      id
    );

    if (!deletedBookingVehicle.affected) {
      throw new NotFoundError('Booking vehicle not found');
    }
  }

  // FIND EXISTING BOOKING VEHICLE
  async findExistingBookingVehicle({
    condition,
  }: {
    condition: object;
  }): Promise<BookingVehicle | null> {
    const existingBookingVehicle = await this.bookingVehicleRepository.findOne({
      where: condition,
    });

    return existingBookingVehicle;
  }
}
