import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { BookingPerson } from '../entities/bookingPerson.entity';
import { UUID } from 'crypto';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../helpers/errors.helper';
import { validateUuid } from '../helpers/validations.helper';
import moment from 'moment';
import { BookingPersonsPagination } from '../types/bookingPerson.types';
import { getPagingData } from '../helpers/pagination.helper';

export class BookingPersonService {
  private bookingPersonRepository: Repository<BookingPerson>;

  constructor() {
    this.bookingPersonRepository = AppDataSource.getRepository(BookingPerson);
  }

  // CREATE BOOKING PERSON
  async createBookingPerson({
    bookingId,
    name,
    dateOfBirth,
    nationality,
    residence,
    gender,
    phone,
    email,
  }: {
    bookingId: UUID;
    name: string;
    nationality: string;
    dateOfBirth: Date;
    residence?: string;
    gender?: string;
    phone?: string;
    email?: string;
  }): Promise<BookingPerson> {
    // VALIDATE BOOKING ID
    if (!bookingId) {
      throw new ValidationError('Booking ID is required');
    }
    const { error: bookingIdError } = validateUuid(bookingId);

    if (bookingIdError) {
      throw new ValidationError('Invalid booking ID');
    }

    // VALIDATE DATE OF BIRTH
    if (!dateOfBirth) {
      throw new ValidationError('Date of birth is required');
    }
    if (moment(dateOfBirth).isAfter(moment())) {
      throw new ValidationError('Invalid date of birth provided');
    }

    // IF NAME IS EMPTY
    if (!name) {
      throw new ValidationError('Name is required');
    }

    // CHECK IF BOOKING PERSON ALREADY EXISTS
    const existingBookingPerson = await this.findExistingBookingPerson({
      condition: { bookingId, name, phone, email, nationality },
    });

    // IF BOOKING PERSON ALREADY EXISTS
    if (existingBookingPerson) {
      throw new ConflictError('Booking person already exists');
    }

    const newBookingPerson = this.bookingPersonRepository.create({
      bookingId,
      name,
      dateOfBirth: moment(dateOfBirth).format('YYYY-MM-DD'),
      nationality,
      residence,
      gender: gender?.toUpperCase() || 'M',
      phone,
      email,
    });

    return this.bookingPersonRepository.save(newBookingPerson);
  }

  // FIND BOOKING PERSON BY NAME AND BOOKING ID
  async findExistingBookingPerson({
    condition,
  }: {
    condition: object;
  }): Promise<BookingPerson | null> {
    return this.bookingPersonRepository.findOne({
      where: condition,
    });
  }

  // FETCH BOOKING PEOPLE
  async fetchBookingPeople({
    condition,
    take,
    skip,
  }: {
    condition: object;
    take?: number;
    skip?: number;
  }): Promise<BookingPersonsPagination> {
    const bookingPeople = await this.bookingPersonRepository.findAndCount({
      where: condition,
      order: { updatedAt: 'DESC' },
    });

    return getPagingData(bookingPeople, take, skip);
  }

  // GET BOOKING PERSON DETAILS
  async getBookingPersonDetails(id: UUID): Promise<BookingPerson> {
    // VALIDATE BOOKING PERSON ID
    if (!id) {
      throw new ValidationError('Booking person ID is required');
    }
    const { error } = validateUuid(id);

    if (error) {
      throw new ValidationError('Invalid booking person ID');
    }

    const bookingPerson = await this.bookingPersonRepository.findOne({
      where: { id },
      relations: {
        booking: true,
      },
    });

    if (!bookingPerson) {
      throw new NotFoundError('Booking person not found');
    }

    return bookingPerson;
  }

  // FIND BOOKING PERSON BY ID
  async findBookingPersonById(id: UUID): Promise<BookingPerson | null> {
    const bookingPersonExists = await this.bookingPersonRepository.findOne({
      where: { id },
    });

    if (!bookingPersonExists) {
      throw new NotFoundError('Booking person not found');
    }

    return bookingPersonExists;
  }

  // UPDATE BOOKING PERSON
  async updateBookingPerson({
    id,
    name,
    dateOfBirth,
    nationality,
    residence,
    phone,
    email,
  }: {
    id: UUID;
    name: string;
    dateOfBirth: Date;
    nationality: string;
    residence?: string;
    phone?: string;
    email?: string;
  }): Promise<BookingPerson> {
    // VALIDATE BOOKING PERSON ID
    if (!id) {
      throw new ValidationError('Booking person ID is required');
    }
    const { error } = validateUuid(id);

    if (error) {
      throw new ValidationError('Invalid booking person ID');
    }

    // VALIDATE DATE OF BIRTH
    if (dateOfBirth) {
      if (moment(dateOfBirth).isAfter(moment())) {
        throw new ValidationError('Invalid date of birth provided');
      }
    }

    const updatedBookingPerson = await this.bookingPersonRepository.update(id, {
      name,
      dateOfBirth: moment(dateOfBirth).format('YYYY-MM-DD'),
      nationality,
      residence,
      phone,
      email,
    });

    if (!updatedBookingPerson.affected) {
      throw new NotFoundError('Booking person not found');
    }

    return updatedBookingPerson.raw[0];
  }

  // DELETE BOOKING PERSON
  async deleteBookingPerson(id: UUID): Promise<void> {
    // VALIDATE BOOKING PERSON ID
    if (!id) {
      throw new ValidationError('Booking person ID is required');
    }
    const { error } = validateUuid(id);

    if (error) {
      throw new ValidationError('Invalid booking person ID');
    }

    const deletedBookingPerson = await this.bookingPersonRepository.delete(id);

    if (!deletedBookingPerson.affected) {
      throw new NotFoundError('Booking person not found');
    }
  }
}
