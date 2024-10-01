import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Booking } from '../entities/booking.entity';
import {
  AppError,
  NotFoundError,
  ValidationError,
} from '../helpers/errors.helper';
import moment from 'moment';
import { BookingPagination } from '../types/booking.types';
import { getPagination, getPagingData } from '../helpers/pagination.helper';
import { UUID } from 'crypto';
import { validateEmail, validateUuid } from '../helpers/validations.helper';
import { ACCOMODATION_OPTION, EXIT_GATE } from '../constants/booking.constants';
import { generateReferenceID } from '../helpers/strings.helper';
import {
  bookingsSearchOtpEmailTemplate,
  bookingSubmittedEmailTemplate,
  sendEmail,
} from '../helpers/emails.helper';
import { BookingActivity } from '../entities/bookingActivity.entity';
import { BookingPerson } from '../entities/bookingPerson.entity';
import { BookingVehicle } from '../entities/bookingVehicle.entity';
import {
  calculateActivityPrice,
  calculateBookingPersonPrice,
  calculateVehiclePrice,
} from '../helpers/booking.helper';
import { createCombinedPDF } from '../helpers/pdf.helper';
import { SettingsService } from './settings.service';
import { BookingToken } from '../entities/token.entity';
import { generateOTP } from '../helpers/auth.helper';

const settingsService = new SettingsService();

export class BookingService {
  private bookingRepository: Repository<Booking>;
  private bookingActivityRepository: Repository<BookingActivity>;
  private bookingVehicleRepository: Repository<BookingVehicle>;
  private bookingPersonRepository: Repository<BookingPerson>;
  private bookingTokenRepository: Repository<BookingToken>;

  constructor() {
    this.bookingRepository = AppDataSource.getRepository(Booking);
    this.bookingActivityRepository =
      AppDataSource.getRepository(BookingActivity);
    this.bookingVehicleRepository = AppDataSource.getRepository(BookingVehicle);
    this.bookingPersonRepository = AppDataSource.getRepository(BookingPerson);
    this.bookingTokenRepository = AppDataSource.getRepository(BookingToken);
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
    size,
    page,
    condition,
  }: {
    size?: number;
    page?: number;
    condition?: object;
  }): Promise<BookingPagination> {
    const { take, skip } = getPagination(page, size);
    const bookings = await this.bookingRepository.findAndCount({
      where: condition,
      take,
      skip,
      order: { startDate: 'ASC' },
    });

    return getPagingData(bookings, size, page);
  }

  // FETCH TIME SERIES DATA
  async fetchTimeSeriesBookings({
    startDate,
    endDate,
    type,
  }: {
    type?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    let selectClause: string;
    let groupByClause: string;
    let orderByClause: string;

    if (startDate && !endDate) {
      throw new ValidationError('End date is required');
    }

    // VALIDATE TYPE
    if (type && !['booking', 'registration'].includes(type)) {
      throw new ValidationError('Invalid booking type');
    }

    const diff =
      startDate && endDate && moment(endDate).diff(moment(startDate), 'months');

    if (!diff || diff < 3) {
      selectClause = `booking.startDate as date, COUNT(*) as count, SUM(booking.totalAmountUsd) as totalAmountUsd`;
      groupByClause = `booking.startDate`;
      orderByClause = `booking.startDate`;
    } else {
      selectClause = `date_part('year', booking.startDate) as yearpart, date_part('month', booking.startDate) as monthpart, COUNT(*) as count, SUM(booking.totalAmountUsd) as totalAmountUsd`;
      groupByClause = `date_part('year', booking.startDate), date_part('month', booking.startDate)`;
      orderByClause = `date_part('year', booking.startDate), date_part('month', booking.startDate)`;
    }

    const query = this.bookingRepository
      .createQueryBuilder('booking')
      .select(selectClause)
      .where('booking.startDate >= :startDate', {
        startDate: moment(startDate).toDate(),
      })
      .andWhere('booking.startDate <= :endDate', {
        endDate: moment(endDate).toDate(),
      })
      .andWhere('booking.status IN (:...status)', {
        status: ['confirmed', 'payment_received'],
      })
      .groupBy(groupByClause)
      .orderBy(orderByClause, 'ASC');

    if (type) {
      query.andWhere('booking.type = :type', { type });
    }

    const result = await query.getRawMany();

    const timeSeriesData = result.map((item) => {
      return {
        date:
          diff && diff >= 3
            ? `${item.yearpart}-${item.monthpart}`
            : moment(item.date).format('MM-DD'),
        value: parseInt(item.count, 10),
        totalAmountUsd: parseFloat(item.totalamountusd),
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

    await this.bookingRepository.update(id, {
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

    const updatedBooking = await this.bookingRepository.findOne({ where: { id } });

    if (!updatedBooking) {
      throw new NotFoundError('Booking not found');
    }

    return updatedBooking;
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
        consent: true,
        phone: true,
        accomodation: true,
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
        accomodation: true,
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

    const bookingPeople = await this.bookingPersonRepository.find({
      where: { bookingId: id },
      relations: { booking: true },
    });

    const combinedPdf = await createCombinedPDF(bookingPeople);

    // SEND EMAIL TO USER
    await sendEmail(
      bookingExists?.email,
      String(process.env.SENDGRID_SEND_FROM),
      `Booking Confirmation - ${bookingExists?.referenceId}`,
      bookingSubmittedEmailTemplate({
        referenceId: bookingExists?.referenceId,
        name: bookingExists?.name,
        totalAmountUsd,
        totalAmountRwf,
      }),
      [
        {
          content: combinedPdf.toString('base64'),
          filename: `Booking_${bookingExists?.referenceId}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ]
    );

    return confirmedBooking.raw[0];
  }

  // UPDATE BOOKING CONSENT
  async updateBookingConsent({
    id,
    consent,
  }: {
    id: UUID;
    consent: boolean;
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

    const updatedBooking = await this.bookingRepository.update(id, {
      consent,
    });

    if (!updatedBooking.affected) {
      throw new NotFoundError('Booking update failed');
    }

    return updatedBooking.raw[0];
  }

  // CALCULATE BOOKING PRICE
  async calculateBookingAmount({ id }: { id: UUID }): Promise<number> {
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

    // FETCH BOOKING PEOPLE
    const bookingPeople = await this.bookingPersonRepository.find({
      where: { bookingId: id },
      relations: {
        booking: true,
      },
    });

    // FETCH BOOKING VEHICLES
    const bookingVehicles = await this.bookingVehicleRepository.find({
      where: { bookingId: id },
    });

    // FETCH BOOKING ACTIVITIES
    const bookingActivities = await this.bookingActivityRepository.find({
      where: { bookingId: id },
      relations: {
        activity: {
          activityRates: true,
        },
      },
    });

    // CALCULATE ENTRY PRICE
    const bookingPeoplePrice =
      bookingPeople?.length > 0
        ? bookingPeople?.reduce((acc, curr) => {
            return acc + calculateBookingPersonPrice(curr);
          }, 0)
        : 0;

    // CALCULATE VEHICLE PRICE
    const bookingVehiclePrice =
      bookingVehicles?.length > 0
        ? bookingVehicles?.reduce((acc, curr) => {
            return acc + calculateVehiclePrice(curr);
          }, 0)
        : 0;

    // CALCULATE ACTIVITY PRICE
    const bookingActivityPrice =
      bookingActivities?.length > 0
        ? bookingActivities?.reduce((acc, curr) => {
            return acc + calculateActivityPrice(curr);
          }, 0)
        : 0;

    const bookingPrice =
      bookingPeoplePrice + bookingVehiclePrice + bookingActivityPrice;

    // GET USD RATE
    const usdRate = await settingsService.getUsdRate();

    bookingExists.totalAmountUsd = bookingPrice;
    bookingExists.totalAmountRwf = bookingPrice * Number(usdRate?.usdRate);

    await this.bookingRepository.save(bookingExists);

    return bookingPrice;
  }

  // DOWNLOAD BOOKING CONSENT
  async downloadBookingConsent({ id }: { id: UUID }): Promise<Buffer> {
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

    // FIND BOOKING PEOPLE
    const bookingPeople = await this.bookingPersonRepository.find({
      where: { bookingId: id },
      relations: { booking: true },
    });

    const consentPdf = await createCombinedPDF(bookingPeople);

    return consentPdf;
  }

  // FIND BOOKING EMAIL
  async findBookingEmail({
    email,
    phone,
    referenceId,
  }: {
    email?: string;
    phone?: string;
    referenceId?: string;
  }): Promise<Booking> {
    const bookingEmail = await this.bookingRepository.findOne({
      where: [{ email }, { phone }, { referenceId }],
      select: [
        'id',
        'name',
        'startDate',
        'endDate',
        'status',
        'email',
        'referenceId',
      ],
    });

    if (!bookingEmail) {
      throw new NotFoundError('Booking not found');
    }

    return bookingEmail;
  }

  // REQUEST BOOKING OTP
  async requestBookingOTP({ email }: { email: string }): Promise<void> {
    // CHECK IF EMAIL OR PHONE IS PROVIDED
    if (!email) {
      throw new ValidationError('Provide email or phone number');
    }

    // FIND BOOKING
    const bookingExists = await this.bookingRepository.findOne({
      where: [{ email }],
    });

    if (!bookingExists) {
      throw new NotFoundError('Booking not found');
    }

    // GENERATE OTP
    const otp = generateOTP();

    // SEND OTP TO EMAIL
    await sendEmail(
      email,
      String(process.env.SENDGRID_SEND_FROM),
      `Your OTP to access search results`,
      bookingsSearchOtpEmailTemplate({
        otp: String(otp),
      })
    );

    // DELETE ALL EXISTING OTPS
    await this.bookingTokenRepository.delete({
      bookingId: bookingExists.id,
      type: 'booking',
    });

    // SAVE OTP
    await this.bookingTokenRepository.save({
      bookingId: bookingExists.id,
      token: String(otp),
      type: 'booking',
      expiresAt: moment().add(10, 'minutes').toDate(),
    });

    return;
  }

  // VERIFY BOOKING OTP
  async verifyBookingOTP({ email, otp }: { email: string; otp: string }): Promise<Booking> {
    // IF EMAIL NOT PROVIDED
    if (!email) {
      throw new ValidationError('Email is required');
    }

    // IF OTP NOT PROVIDED
    if (!otp) {
      throw new ValidationError('OTP is required');
    }

    // VALIDATE EMAIL
    const { error } = validateEmail(email);

    if (error) {
      throw new ValidationError('Invalid email address');
    }

    // FIND BOOKING
    const bookingExists = await this.bookingRepository.findOne({
      where: { email },
    });

    // IF BOOKING NOT FOUND
    if (!bookingExists) {
      throw new NotFoundError('Booking not found');
    }

    // FIND OTP
    const tokenExists = await this.bookingTokenRepository.findOne({
      where: {
        bookingId: bookingExists.id,
        token: otp,
        type: 'booking',
      },
    });

    // IF OTP NOT FOUND
    if (!tokenExists) {
      throw new NotFoundError('Invalid OTP');
    }

    // CHECK IF TOKEN IS NOT EXPIRED
    if (moment(tokenExists?.expiresAt).format() < moment().format()) {
      throw new ValidationError('Token has expired. Please request a new one');
    }

    // DELETE TOKEN
    await this.bookingTokenRepository.delete({
      bookingId: bookingExists.id,
      type: 'booking',
    });

    return bookingExists;
  }
}
