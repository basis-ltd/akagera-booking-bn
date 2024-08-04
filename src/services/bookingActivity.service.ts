import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { BookingActivity } from '../entities/bookingActivity.entity';
import { NotFoundError, ValidationError } from '../helpers/errors.helper';
import { UUID } from 'crypto';
import { validateUuid } from '../helpers/validations.helper';
import { ActivitySchedule } from '../entities/activitySchedule.entity';
import { BookingActivityPagination } from '../types/bookingActivity.types';
import { getPagination, getPagingData } from '../helpers/pagination.helper';
import moment from 'moment';
import { BookingActivityPerson } from '../entities/bookingActivityPerson.entity';

export class BookingActivityService {
  private bookingActivityRepository: Repository<BookingActivity>;
  private bookingActivityPeopleRepository: Repository<BookingActivityPerson>;
  private activityScheduleRepository: Repository<ActivitySchedule>;

  constructor() {
    this.bookingActivityRepository =
      AppDataSource.getRepository(BookingActivity);
    this.bookingActivityPeopleRepository = AppDataSource.getRepository(
      BookingActivityPerson
    );
    this.activityScheduleRepository = AppDataSource.getRepository(
      ActivitySchedule
    );
  }

  // CREATE BOOKING ACTIVITY
  async createBookingActivity({
    startTime,
    endTime,
    bookingId,
    activityId,
    numberOfAdults,
    numberOfChildren,
    numberOfSeats,
    defaultRate,
  }: {
    startTime: Date;
    endTime?: Date;
    bookingId: UUID;
    activityId: UUID;
    numberOfAdults?: number;
    numberOfChildren?: number;
    numberOfSeats: number;
    defaultRate?: number;
  }): Promise<BookingActivity> {
    // IF NO BOOKING ID
    if (!bookingId) {
      throw new ValidationError('Booking ID is required');
    }

    // VALIDATE BOOKING ID
    const { error: bookingIdError } = validateUuid(bookingId);
    if (bookingIdError) {
      throw new ValidationError('Invalid booking ID');
    }

    // IF NO ACTIVITY ID
    if (!activityId) {
      throw new ValidationError('Activity ID is required');
    }

    // VALIDATE ACTIVITY ID
    const { error: activityIdError } = validateUuid(activityId);
    if (activityIdError) {
      throw new ValidationError('Invalid activity ID');
    }
    // IF NO START TIME
    if (!startTime) {
      throw new ValidationError('Start time is required');
    }

    // CREATE BOOKING ACTIVITY
    const bookingActivity = this.bookingActivityRepository.create({
      startTime,
      endTime,
      bookingId,
      activityId,
      numberOfAdults,
      numberOfChildren,
      numberOfSeats,
      defaultRate,
    });

    // SAVE BOOKING ACTIVITY
    return this.bookingActivityRepository.save(bookingActivity);
  }

  // FETCH BOOKING ACTIVITIES BY BOOKING ID
  async fetchBookingActivities({
    condition,
    size,
    page,
  }: {
    condition:
      | FindOptionsWhere<BookingActivity>
      | FindOptionsWhere<BookingActivity>[]
      | undefined;
    size?: number;
    page?: number;
  }): Promise<BookingActivityPagination> {
    const { take, skip } = getPagination(page, size);
    // FETCH BOOKING ACTIVITIES
    const bookingActivities = await this.bookingActivityRepository.findAndCount(
      {
        where: condition,
        take,
        skip,
        relations: {
          activity: {
            activityRates: true,
            activitySchedules: true,
          },
          booking: true,
          bookingActivityPeople: {
            bookingPerson: true,
          },
        },
      }
    );

    return getPagingData(bookingActivities, size, page);
  }

  // FETCH POPULAR ACTIVITIES
  async fetchPopularActivities({
    size,
    page,
    startDate,
    endDate
  }: {
    size?: number;
    page?: number;
    startDate?: Date;
    endDate?: Date;
  }) {
    const { take, skip } = getPagination(page, size);
    // FETCH POPULAR ACTIVITIES
    const query = this.bookingActivityRepository
      .createQueryBuilder('bookingActivity')
      .select('count(bookingActivity.id) as count, activity.id, activity.name')
      .groupBy('activity.id')
      .leftJoinAndSelect('bookingActivity.activity', 'activity')
      .orderBy('count', 'DESC');

      if (startDate) {
        query.andWhere('bookingActivity.startTime >= :startDate', {
          startDate: moment(startDate).format(),
        });
      }

      if (endDate) {
        query.andWhere('bookingActivity.startTime <= :endDate', {
          endDate: moment(endDate).format(),
        });
      }

    return await query.take(take).skip(skip).getRawMany();
  }

  // FIND BOOKING ACTIVITY BY ID
  async findBookingActivityById(id: UUID): Promise<BookingActivity> {
    // VALIDATE BOOKING ACTIVITY ID
    const { error } = validateUuid(id);
    if (error) {
      throw new ValidationError('Invalid booking activity ID');
    }

    // FIND BOOKING ACTIVITY
    const bookingActivityExists = await this.bookingActivityRepository.findOne({
      where: { id },
      select: {
        id: true,
        bookingId: true,
        activityId: true,
      },
    });

    // IF BOOKING ACTIVITY NOT FOUND
    if (!bookingActivityExists) {
      throw new ValidationError('Booking activity not found');
    }

    return bookingActivityExists;
  }

  // GET BOOKING ID DETAILS
  async getBookingActivityDetails(id: UUID): Promise<BookingActivity> {
    // VALIDATE BOOKING ACTIVITY ID
    const { error } = validateUuid(id);
    if (error) {
      throw new ValidationError('Invalid booking activity ID');
    }

    // FIND BOOKING ACTIVITY
    const bookingActivity = await this.bookingActivityRepository.findOne({
      where: { id },
      relations: {
        activity: {
          activitySchedules: true,
        },
      },
    });

    if (!bookingActivity) {
      throw new ValidationError('Booking activity not found');
    }

    return bookingActivity;
  }

  // DELETE BOOKING ACTIVITY
  async deleteBookingActivity(id: UUID): Promise<void> {
    // VALIDATE BOOKING ACTIVITY ID
    const { error } = validateUuid(id);
    if (error) {
      throw new ValidationError('Invalid booking activity ID');
    }

    // CHECK IF BOOKING ACTIVITY HAS ASSOCIATED BOOKING ACTIVITY PEOPLE AND DELETE
    const bookingActivityPeople =
      await this.bookingActivityPeopleRepository.find({
        where: { bookingActivityId: id },
      });

    if (bookingActivityPeople.length > 0) {
      await this.bookingActivityPeopleRepository.delete({
        bookingActivityId: id,
      });
    }

    // DELETE BOOKING ACTIVITY
    const bookingActivityDeleted = await this.bookingActivityRepository.delete({
      id,
    });

    // IF BOOKING ACTIVITY NOT FOUND
    if (!bookingActivityDeleted.affected) {
      throw new ValidationError('Booking activity not found');
    }
  }

  // UPDATE BOOKING ACTIVITY
  async updateBookingActivity({
    id,
    startTime,
    endTime,
    activityId,
    numberOfAdults,
    numberOfChildren,
    numberOfSeats,
    defaultRate,
  }: {
    id: UUID;
    startTime: Date;
    endTime?: Date;
    activityId: UUID;
    numberOfAdults?: number;
    numberOfChildren?: number;
    numberOfSeats: number;
    defaultRate?: number;
  }): Promise<BookingActivity> {
    // VALIDATE BOOKING ACTIVITY ID
    const { error } = validateUuid(id);
    if (error) {
      throw new ValidationError('Invalid booking activity ID');
    }

    // FIND BOOKING ACTIVITY
    const bookingActivity = await this.bookingActivityRepository.findOne({
      where: { id },
    });

    // IF BOOKING ACTIVITY NOT FOUND
    if (!bookingActivity) {
      throw new ValidationError('Booking activity not found');
    }

    // UPDATE BOOKING ACTIVITY
    const updatedBookingActivity = await this.bookingActivityRepository.update(
      id,
      {
        startTime: startTime && moment(startTime).format(),
        endTime: endTime && moment(endTime).format(),
        numberOfAdults,
        numberOfChildren,
        numberOfSeats,
        defaultRate,
      }
    );

    return updatedBookingActivity.raw[0];
  }

}
