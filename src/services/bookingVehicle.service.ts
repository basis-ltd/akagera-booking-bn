import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { BookingVehicle } from '../entities/bookingVehicle.entity';
import { UUID } from 'crypto';
import { validateUuid } from '../helpers/validations.helper';
import { ConflictError, NotFoundError, ValidationError } from '../helpers/errors.helper';
import { BookingVehiclesPagination } from '../types/bookingVehicle.types';
import { getPagingData } from '../helpers/pagination.helper';

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
  }: {
    bookingId: UUID;
    plateNumber: string;
    vehicleType: string;
  }): Promise<BookingVehicle> {
    // IF NO BOOKING ID
    if (!bookingId) {
      throw new Error('Booking ID is required');
    }

    const { error } = validateUuid(bookingId);
    if (error) {
      throw new ValidationError('Invalid booking ID');
    }

    // IF NO PLATE NUMBER
    if (!plateNumber) {
      throw new ValidationError('Plate number is required');
    }

    // IF NO VEHICLE TYPE
    if (!vehicleType) {
      throw new ValidationError('Vehicle type is required');
    }

    // CHECK IF BOOKING VEHICLE EXISTS
    const existingBookingVehicle = await this.findExistingBookingVehicle({
      condition: { plateNumber, bookingId },
    });

    if (existingBookingVehicle) {
      throw new ConflictError('Booking vehicle already exists', {
        id: existingBookingVehicle.id,
      });
    }

    // CREATE BOOKING VEHICLE
    const bookingVehicle = this.bookingVehicleRepository.create({
      bookingId,
      plateNumber,
      vehicleType,
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

    if (!bookingVehicles[0].length) {
      throw new NotFoundError('No booking vehicles found');
    }

    return getPagingData(bookingVehicles, take, skip);
  }

  // UPDATE BOOKING VEHICLE
  async updateBookingVehicle({
    id,
    plateNumber,
    vehicleType,
    bookingId,
  }: {
    id: UUID;
    plateNumber: string;
    vehicleType: string;
    bookingId: UUID;
  }): Promise<BookingVehicle> {
    const { error } = validateUuid(id);
    if (error) {
      throw new ValidationError('Invalid booking vehicle ID');
    }

    const updatedBookingVehicle = await this.bookingVehicleRepository.update(
      id,
      {
        plateNumber,
        vehicleType,
        bookingId,
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
