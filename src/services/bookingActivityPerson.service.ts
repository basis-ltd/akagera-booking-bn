import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { BookingActivityPerson } from '../entities/bookingActivityPerson.entity';
import { UUID } from 'crypto';
import { ValidationError } from '../helpers/errors.helper';
import { BookingPersonsPagination } from '../types/bookingPerson.types';
import { getPagination, getPagingData } from '../helpers/pagination.helper';

export class BookingActivityPersonService {
  private bookingActivityPersonRepository: Repository<BookingActivityPerson>;

  constructor() {
    this.bookingActivityPersonRepository = AppDataSource.getRepository(
      BookingActivityPerson
    );
  }

  // CREATE BOOKING ACTIVITY PERSON
  async createBookingActivityPerson({
    bookingActivityPeople,
  }: {
    bookingActivityPeople: {
      bookingActivityId: UUID;
      bookingPersonId: UUID;
    }[];
  }): Promise<BookingActivityPerson[]> {
    // VALIDATE BOOKING ACTIVITY PEOPLE
    if (!bookingActivityPeople || !bookingActivityPeople.length) {
      throw new ValidationError('Booking activity people are required');
    }

    bookingActivityPeople.forEach((bookingActivityPerson) => {
      if (!bookingActivityPerson.bookingActivityId) {
        throw new ValidationError('Booking activity ID is required');
      }
      if (!bookingActivityPerson.bookingPersonId) {
        throw new ValidationError('Booking person ID is required');
      }
    });

    // INITIALIZE BOOKING ACTIVITY PERSON
    let createdBookingActivityPeople: BookingActivityPerson[] = [];

    // CREATE BOOKING ACTIVITY PERSON
    Promise.all(
      bookingActivityPeople.map(async (bookingActivityPerson) => {
        const createdBookingActivityPerson =
          await this.bookingActivityPersonRepository.save(
            this.bookingActivityPersonRepository.create(bookingActivityPerson)
          );
        createdBookingActivityPeople.push(createdBookingActivityPerson);
      })
    );
    return createdBookingActivityPeople;
  }

  // FETCH BOOKING ACTIVITY PEOPLE
  async fetchBookingActivityPeople({
    condition,
    size,
    page,
  }: {
    condition: object;
    size?: number;
    page?: number;
  }): Promise<BookingPersonsPagination> {
    const { take, skip } = getPagination(page, size);
    // FETCH BOOKING ACTIVITY PEOPLE
    const bookingActivityPeople =
      await this.bookingActivityPersonRepository.findAndCount({
        where: condition,
        take,
        skip,
        order: { updatedAt: 'DESC' },
        relations: {
          bookingActivity: {
            activity: {
              activityRates: true,
            },
          },
        },
      });
    return getPagingData(bookingActivityPeople, size, page);
  }

  // FIND BOOKING ACTIVITY PERSON BY ID
  async findBookingActivityPersonById(
    id: UUID
  ): Promise<BookingActivityPerson> {
    // VALIDATE BOOKING ACTIVITY PERSON ID
    if (!id) {
      throw new ValidationError('Booking activity person ID is required');
    }

    // FIND BOOKING ACTIVITY PERSON
    const bookingActivityPerson =
      await this.bookingActivityPersonRepository.findOne({
        where: { id },
        select: ['id', 'bookingActivityId', 'bookingPersonId'],
      });

    if (!bookingActivityPerson) {
      throw new ValidationError('Booking activity person not found');
    }

    return bookingActivityPerson;
  }

  // GET BOOKING ACTIVITY PERSON DETAILS
  async getBookingActivityPersonDetails(
    id: UUID
  ): Promise<BookingActivityPerson> {
    // VALIDATE BOOKING ACTIVITY PERSON ID
    if (!id) {
      throw new ValidationError('Booking activity person ID is required');
    }

    // FIND BOOKING ACTIVITY PERSON
    const bookingActivityPerson =
      await this.bookingActivityPersonRepository.findOne({
        where: { id },
        relations: {
          bookingActivity: {
            activity: {
              activityRates: true,
            },
          },
        },
      });

    if (!bookingActivityPerson) {
      throw new ValidationError('Booking activity person not found');
    }

    return bookingActivityPerson;
  }

  // DELETE BOOKING ACTIVITY PERSON
  async deleteBookingActivityPerson(id: UUID): Promise<void> {
    // VALIDATE BOOKING ACTIVITY PERSON ID
    if (!id) {
      throw new ValidationError('Booking activity person ID is required');
    }
    // DELETE BOOKING ACTIVITY PERSON
    const deletedBookingActivityPerson =
      await this.bookingActivityPersonRepository.delete({ id });

    if (!deletedBookingActivityPerson.affected) {
      throw new ValidationError('Booking activity person not found');
    }
  }
}
