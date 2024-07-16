import { Between, FindOptionsWhere, Repository } from 'typeorm';
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
import { getPagination, getPagingData } from '../helpers/pagination.helper';
import { Booking } from '../entities/booking.entity';
import { ACCOMODATION_OPTION } from '../constants/booking.constants';

export class BookingPersonService {
  private bookingPersonRepository: Repository<BookingPerson>;
  private bookingRepository: Repository<Booking>;

  constructor() {
    this.bookingPersonRepository = AppDataSource.getRepository(BookingPerson);
    this.bookingRepository = AppDataSource.getRepository(Booking);
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
    startDate,
    endDate,
    accomodation,
  }: {
    bookingId: UUID;
    name: string;
    nationality: string;
    dateOfBirth: Date;
    residence?: string;
    gender?: string;
    phone?: string;
    email?: string;
    startDate?: Date;
    endDate?: Date;
    accomodation?: string;
  }): Promise<BookingPerson> {
    // VALIDATE BOOKING ID
    if (!bookingId) {
      throw new ValidationError('Booking ID is required');
    }
    const { error: bookingIdError } = validateUuid(bookingId);

    if (bookingIdError) {
      throw new ValidationError('Invalid booking ID');
    }

    // CHECK IF ACCOMODATION VALUE IS VALID
    if (
      accomodation &&
      !Object.values(ACCOMODATION_OPTION).includes(accomodation)
    ) {
      throw new ValidationError('Invalid accomodation option');
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

    // CHECK IF BOOKING EXISTS
    const bookingExists = await this.bookingRepository.findOne({
      where: { id: bookingId },
    });

    if (!bookingExists) {
      throw new NotFoundError('Booking not found');
    }

    // CHECK IF BOOKING PERSON ALREADY EXISTS
    const existingBookingPerson = await this.findExistingBookingPerson({
      condition: {
        bookingId,
        name,
        dateOfBirth,
        gender,
        nationality,
        residence,
      },
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
      startDate: bookingExists?.startDate,
      endDate: bookingExists?.endDate,
      accomodation,
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
    size,
    page,
  }: {
    condition: object;
    size?: number;
    page?: number;
  }): Promise<BookingPersonsPagination> {
    const bookingPeople = await this.bookingPersonRepository.findAndCount({
      where: condition,
      order: { updatedAt: 'DESC' },
    });

    return getPagingData(bookingPeople, size, page);
  }

  // FETCH POPULAR BOOKING PEOPLE
  async fetchPopularBookingPeople({
    criteria,
    size,
    page,
    startDate,
    endDate
  }: {
    criteria: 'residence' | 'nationality' | 'dateOfBirth' | 'gender';
    size?: number;
    page?: number;
    startDate?: Date;
    endDate?: Date;
  }): Promise<{ value: string | number; count: number }[]> {
    const { take, skip } = getPagination(page, size);
    const queryBuilder = this.bookingPersonRepository.createQueryBuilder('bookingPerson');
  
    if (!['residence', 'nationality', 'dateOfBirth', 'gender'].includes(criteria)) {
      throw new ValidationError('Invalid criteria provided');
    }
  
    queryBuilder
      .select(`bookingPerson.${criteria}`, 'value')
      .addSelect('COUNT(bookingPerson.id)', 'count')
      .groupBy(`bookingPerson.${criteria}`)
      .orderBy('count', 'DESC');
  
    if (startDate) {
      queryBuilder.andWhere('bookingPerson.startDate >= :startDate', {
        startDate: moment(startDate).toDate(),
      });
    }

    if (endDate) {
      queryBuilder.andWhere('bookingPerson.startDate <= :endDate', {
        endDate: moment(endDate).toDate(),
      });
    }
  
    if (size) {
      queryBuilder.take(take);
    }
  
    if (page) {
      queryBuilder.skip(skip);
    }
  
    const result = await queryBuilder.getRawMany();
  
    return result.map((item) => {
      return {
        value:
          criteria === 'dateOfBirth'
            ? moment().diff(item.value, 'years')
            : item.value,
        count: Number(item.count),
      };
    });
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
    startDate,
    endDate,
    accomodation,
  }: {
    id: UUID;
    name: string;
    dateOfBirth: Date;
    nationality: string;
    residence?: string;
    phone?: string;
    email?: string;
    startDate?: Date;
    endDate?: Date;
    accomodation?: string;
  }): Promise<BookingPerson> {
    // VALIDATE BOOKING PERSON ID
    if (!id) {
      throw new ValidationError('Booking person ID is required');
    }
    const { error } = validateUuid(id);

    if (error) {
      throw new ValidationError('Invalid booking person ID');
    }

    // CHECK IF ACCOMODATION VALUE IS VALID
    if (
      accomodation &&
      !Object.values(ACCOMODATION_OPTION).includes(accomodation)
    ) {
      throw new ValidationError('Invalid accomodation option');
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
      startDate,
      endDate,
      accomodation,
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

  // FETCH BOOKING PEOPLE STATS
  async fetchBookingPeopleStats({
    condition,
    size,
    page,
  }: {
    condition?: object;
    size?: number;
    page?: number;
  }): Promise<BookingPersonsPagination> {
    if (!condition) {
      throw new ValidationError('Month is required');
    }
    const {take, skip} = getPagination(page, size);

    const bookingPeople = await this.bookingPersonRepository.findAndCount({
      where: condition,
      relations: {
        booking: {
          bookingActivities: true,
          bookingVehicles: true,
        },
      },
      take,
      skip,
    });

    return getPagingData(bookingPeople, size, page);
  };
}
