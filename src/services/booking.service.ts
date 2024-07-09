import { LessThanOrEqual, Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Booking } from '../entities/booking.entity';
import {
  AppError,
  NotFoundError,
  ValidationError,
} from '../helpers/errors.helper';
import moment from 'moment';
import { BookingPagination } from '../types/booking.types';
import { getPagingData } from '../helpers/pagination.helper';
import { UUID } from 'crypto';
import { validateUuid } from '../helpers/validations.helper';
import { ACCOMODATION_OPTION, EXIT_GATE } from '../constants/booking.constants';
import { generateReferenceID } from '../helpers/strings.helper';
import {
  bookingSubmittedEmailTemplate,
  sendEmail,
} from '../helpers/emails.helper';

export class BookingService {
  private bookingRepository: Repository<Booking>;

  constructor() {
    this.bookingRepository = AppDataSource.getRepository(Booking);
  }

  // CREATE BOOKING
  async createBooking({
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
    accomodation,
    type,
  }: {
    startDate: Date;
    endDate?: Date;
    name: string;
    notes?: string;
    email: string;
    phone: string;
    approvedAt?: Date;
    status: string;
    totalAmountRwf?: number;
    totalAmountUsd?: number;
    discountedAmountRwf?: number;
    discountedAmountUsd?: number;
    exitGate?: string;
    entryGate?: string;
    accomodation?: string;
    type?: string;
  }): Promise<Booking> {
    // IF NAME NOT PROVIDED
    if (!name) {
      throw new ValidationError('Name is required');
    }

    // IF START TIME NOT PROVIDED
    if (!startDate) {
      throw new ValidationError('Booking date is required');
    }

    // VALIDATE TYPE
    if (type && type !== 'booking' && type !== 'registration') {
      throw new ValidationError('Invalid booking type');
    }

    // IF NO CREATED BY
    if (!email && !phone) {
      throw new ValidationError('Provide email or phone number');
    }

    // CHECK IF EXIT GATE VALUE IS VALID
    if (exitGate && !Object.values(EXIT_GATE).includes(exitGate)) {
      throw new ValidationError('Invalid exit gate');
    }

    // CHECK IF ACCOMODATION VALUE IS VALID
    if (
      accomodation &&
      !Object.values(ACCOMODATION_OPTION).includes(accomodation)
    ) {
      throw new ValidationError('Invalid accomodation option');
    }

    const newBooking = this.bookingRepository.create({
      startDate,
      endDate: endDate || moment(startDate).add(23, 'hours').toDate(),
      name,
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
      accomodation,
      type,
      referenceId: generateReferenceID(),
    });

    return this.bookingRepository.save(newBooking);
  }

  // FETCH BOOKINGS
  async fetchBookings({
    take,
    skip,
    condition,
  }: {
    take?: number;
    skip?: number;
    condition?: object;
  }): Promise<BookingPagination> {
    const bookings = await this.bookingRepository.findAndCount({
      where: condition,
      take,
      skip,
      order: { startDate: 'ASC' },
    });

    return getPagingData(bookings, take, skip);
  }

  // FETCH TIME SERIES DATA
  async fetchTimeSeriesBookings({
    year,
    month,
    granularity,
    type,
  }: {
    year: number;
    month?: number;
    granularity: 'day' | 'month';
    type?: string;
  }) {
    let startDate: Date;
    let endDate: Date;
    let selectClause: string;
    let groupByClause: string;
    let orderByClause: string;

    // VALIDATE TYPE
    if (type && !['booking', 'registration'].includes(type)){
      throw new ValidationError('Invalid booking type');
    }

    if (granularity === 'day') {
      if (month === undefined) {
        throw new ValidationError('Month is required for day granularity');
      }
      startDate = moment().year(year).month(month - 1).startOf('month').toDate();
      endDate = moment().year(year).month(month - 1).endOf('month').toDate();
      selectClause = 'DATE(booking.startDate) as datePart, COUNT(*) as count';
      groupByClause = 'DATE(booking.startDate)';
      orderByClause = 'DATE(booking.startDate)';
    } else if (granularity === 'month') {
      startDate = moment().year(year).startOf('year').toDate();
      endDate = moment().year(year).endOf('year').toDate();
      selectClause = `date_part('year', booking.startDate) as yearPart, date_part('month', booking.startDate) as monthPart, COUNT(*) as count`;
      groupByClause = `date_part('year', booking.startDate), date_part('month', booking.startDate)`;
      orderByClause = `date_part('year', booking.startDate), date_part('month', booking.startDate)`;
    } else {
      throw new ValidationError('Invalid granularity. Use day or month.');
    }

    const query = this.bookingRepository.createQueryBuilder('booking')
      .select(selectClause)
      .where('booking.startDate >= :startDate', { startDate })
      .andWhere('booking.startDate <= :endDate', { endDate })
      .groupBy(groupByClause)
      .orderBy(orderByClause, 'ASC');

    if (type) {
      query.andWhere('booking.type = :type', { type });
    }

    const result = await query.getRawMany();

    const timeSeriesData = result.map((item) => {
      return {
        date:
          granularity === 'day'
            ? moment(item?.datepart).format('MM-DD')
            : moment(item?.datepart).format('YYYY-MM'),
        value: parseInt(item.count, 10),
      };
    });

    return timeSeriesData;
  }
    
    // UPDATE BOOKING
  async updateBooking({
    id,
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
    accomodation,
    type,
  }: {
    id: UUID;
    startDate: Date;
    endDate?: Date;
    name: string;
    notes?: string;
    email: string;
    phone: string;
    approvedAt?: Date;
    status: string;
    totalAmountRwf?: number;
    totalAmountUsd?: number;
    discountedAmountRwf?: number;
    discountedAmountUsd?: number;
    exitGate?: string;
    entryGate?: string;
    accomodation?: string;
    type?: string;
  }): Promise<Booking> {
    // CHECK IF EXIT GATE VALUE IS VALID
    if (exitGate && !Object.values(EXIT_GATE).includes(exitGate)) {
      throw new ValidationError('Invalid exit gate');
    }

    // VALIDATE TYPE
    if (type && type !== 'booking' && type !== 'registration') {
      throw new ValidationError('Invalid booking type');
    }

    // CHECK IF ACCOMODATION VALUE IS VALID
    if (
      accomodation &&
      !Object.values(ACCOMODATION_OPTION).includes(accomodation)
    ) {
      throw new ValidationError('Invalid accomodation option');
    }

    // CHECK IF BOOKING EXISTS
    const bookingExists = await this.bookingRepository.findOne({
      where: { id },
    });

    // IF BOOKING DOES NOT EXIST
    if (!bookingExists) {
      throw new NotFoundError('Booking not found');
    }

    // VALIDATE START AND END DATE
    if (
      (startDate && endDate && moment(startDate).isAfter(endDate)) ||
      (endDate && moment(bookingExists.startDate).isAfter(endDate)) ||
      (startDate && moment(bookingExists.endDate).isBefore(startDate)) ||
      (startDate && moment(startDate).isAfter(bookingExists.endDate))
    ) {
      throw new ValidationError('Start date cannot be after end date');
    }

    const updatedBooking = await this.bookingRepository.update(id, {
      startDate,
      endDate,
      name,
      notes,
      email,
      phone,
      approvedAt,
      status,
      totalAmountRwf,
      exitGate,
      entryGate,
      totalAmountUsd,
      discountedAmountRwf,
      discountedAmountUsd,
      accomodation,
      type,
    });

    if (!updatedBooking.affected) {
      throw new AppError('Booking update failed', 500, 'INTERNAL_SERVER_ERROR');
    }

    return updatedBooking.raw[0];
  }

  // FIND BOOKING BY ID
  async findBookingById(id: UUID): Promise<Booking> {
    const bookingExists = await this.bookingRepository.findOne({
      where: { id },
      select: ['id', 'name', 'startDate', 'endDate', 'status'],
    });

    if (!bookingExists) {
      throw new NotFoundError('Booking not found');
    }

    return bookingExists;
  }

  // GET BOOKING DETAILS BY ID
  async getBookingDetails(id: UUID): Promise<Booking> {
    const bookingDetails = await this.bookingRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        status: true,
        totalAmountRwf: true,
        totalAmountUsd: true,
        discountedAmountRwf: true,
        discountedAmountUsd: true,
        notes: true,
        referenceId: true,
        createdAt: true,
        updatedAt: true,
        email: true,
        phone: true,
        type: true,
        approvedByUser: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          gender: true,
        },
        bookingPeople: true,
      },
      relations: {
        approvedByUser: true,
        bookingPeople: true,
      },
    });

    if (!bookingDetails) {
      throw new NotFoundError('Booking not found');
    }

    return bookingDetails;
  }

  // GET BOOKING DETAILS BY REFERENCE ID
  async getBookingDetailsByReferenceId(referenceId: string): Promise<Booking> {
    const bookingDetails = await this.bookingRepository.findOne({
      where: { referenceId },
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        status: true,
        totalAmountRwf: true,
        totalAmountUsd: true,
        discountedAmountRwf: true,
        discountedAmountUsd: true,
        notes: true,
        type: true,
        referenceId: true,
        createdAt: true,
        updatedAt: true,
        approvedByUser: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          gender: true,
        },
      },
      relations: {
        approvedByUser: true,
      },
    });

    if (!bookingDetails) {
      throw new NotFoundError('Booking not found');
    }

    return bookingDetails;
  }

  // DELETE BOOKING
  async deleteBooking(id: UUID): Promise<void> {
    // VALIDATE UUID
    const { error } = validateUuid(id);

    if (error) {
      throw new ValidationError('Invalid ID');
    }

    const deletedBooking = await this.bookingRepository.delete(id);

    if (!deletedBooking.affected) {
      throw new NotFoundError('Booking not found');
    }
  }

  // FETCH BOOKING STATUSES
  async fetchBookingStatuses({
    condition,
  }: {
    condition?: object;
  }): Promise<Booking[]> {
    return await this.bookingRepository.find({
      select: ['status', 'id'],
      where: condition,
    });
  }

  // SUBMIT BOOKING
  async submitBooking({
    id,
    status,
    totalAmountRwf,
    totalAmountUsd,
  }: {
    id: UUID;
    status: string;
    totalAmountRwf: number;
    totalAmountUsd: number;
  }): Promise<Booking> {
    // VALIDATE UUID
    const { error } = validateUuid(id);

    if (error) {
      throw new ValidationError('Invalid ID');
    }

    // CHECK IF BOOKING EXISTS
    const bookingExists = await this.bookingRepository.findOne({
      where: { id },
    });

    if (!bookingExists) {
      throw new NotFoundError('Booking not found');
    }

    const confirmedBooking = await this.bookingRepository.update(id, {
      status,
      totalAmountRwf,
      totalAmountUsd,
    });

    if (!confirmedBooking.affected) {
      throw new NotFoundError('Booking confirmation not found');
    }

    // SEND EMAIL TO USER
    await sendEmail(
      bookingExists?.email,
      String(process.env.SENDGRID_SEND_FROM),
      `Booking Confirmation - ${bookingExists?.referenceId}`,
      bookingSubmittedEmailTemplate({
        referenceId: bookingExists?.referenceId,
        name: bookingExists?.name,
      })
    );

    return confirmedBooking.raw[0];
  }
}
