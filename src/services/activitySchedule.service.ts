import { ActivitySchedule } from '../entities/activitySchedule.entity';
import { AppDataSource } from '../data-source';
import { UUID } from 'crypto';
import {
  validateStartAndEndTime,
  validateUuid,
} from '../helpers/validations.helper';
import { NotFoundError, ValidationError } from '../helpers/errors.helper';
import { Between, LessThanOrEqual, Repository } from 'typeorm';
import { Activity } from '../entities/activity.entity';
import moment from 'moment';
import { getPagination, getPagingData } from '../helpers/pagination.helper';
import { ActivitySchedulesPagination } from '../types/activitySchedule.types';
import { BookingActivity } from '../entities/bookingActivity.entity';
import { SeatsAdjustment } from '../entities/seatsAdjustment.entity';
import logger from '../helpers/logger.helper';

export class ActivityScheduleService {
  private activityScheduleRepository: Repository<ActivitySchedule>;
  private activityRepository: Repository<Activity>;
  private bookingActivityRepository: Repository<BookingActivity>;
  private seatsAdjustmentRepository: Repository<SeatsAdjustment>;

  constructor() {
    this.activityScheduleRepository =
      AppDataSource.getRepository(ActivitySchedule);
    this.activityRepository = AppDataSource.getRepository(Activity);
    this.bookingActivityRepository =
      AppDataSource.getRepository(BookingActivity);
    this.seatsAdjustmentRepository =
      AppDataSource.getRepository(SeatsAdjustment);
  }

  // CREATE ACTIVITY SCHEDULE
  async createActivitySchedule({
    startTime,
    endTime,
    description,
    disclaimer,
    activityId,
    numberOfSeats,
    minNumberOfSeats,
    maxNumberOfSeats,
  }: {
    startTime: string;
    endTime: string;
    description: string;
    disclaimer: string;
    activityId: UUID;
    numberOfSeats: number;
    minNumberOfSeats?: number;
    maxNumberOfSeats?: number;
  }): Promise<ActivitySchedule> {
    // VALIDATE ACTIVITY ID
    if (!activityId) {
      throw new ValidationError('Activity ID is required');
    }

    const { error } = validateUuid(activityId);

    if (error) {
      throw new ValidationError('Invalid Activity ID');
    }

    // CHECK IF ACTIVITY EXISTS
    const activityExists = await this.activityRepository.findOne({
      where: { id: activityId },
    });

    // IF ACTIVITY DOES NOT EXIST
    if (!activityExists) {
      throw new ValidationError('Activity not found');
    }

    // VALIDATE START AND END TIME
    validateStartAndEndTime(
      moment(startTime, 'HH:mm:ss'),
      moment(endTime, 'HH:mm:ss')
    );

    // CREATE ACTIVITY SCHEDULE
    const activitySchedule = this.activityScheduleRepository.create({
      startTime: String(moment(startTime, 'HH:mm:ss').format('HH:mm:ss')),
      endTime:
        endTime && String(moment(endTime, 'HH:mm:ss').format('HH:mm:ss')),
      description,
      disclaimer,
      activityId,
      numberOfSeats,
      minNumberOfSeats,
      maxNumberOfSeats,
    });

    logger.info(
      `New activity schedule ${startTime} - ${endTime} has been added for activity ${activityExists?.name}`
    );

    // SAVE ACTIVITY SCHEDULE
    return this.activityScheduleRepository.save(activitySchedule);
  }

  // GET ACTIVITY SCHEDULE BY ID
  async findActivityScheduleById(id: UUID): Promise<ActivitySchedule> {
    // VALIDATE ID
    const { error } = validateUuid(id);

    if (error) {
      throw new ValidationError('Invalid ID');
    }

    const activitySchedule = await this.activityScheduleRepository.findOne({
      where: { id },
    });

    if (!activitySchedule) {
      throw new Error('Activity Schedule not found');
    }

    return activitySchedule;
  }

  // GET ACTIVITY SCHEDULES
  async fetchActivitySchedules({
    page,
    size,
    condition,
  }: {
    page?: number;
    size?: number;
    condition?: object | undefined;
  }): Promise<ActivitySchedulesPagination> {
    const { take, skip } = getPagination(page, size);
    const activitySchedules =
      await this.activityScheduleRepository.findAndCount({
        where: condition,
        take,
        skip,
        select: {
          id: true,
          startTime: true,
          endTime: true,
          description: true,
          disclaimer: true,
          createdAt: true,
          updatedAt: true,
          numberOfSeats: true,
          minNumberOfSeats: true,
          maxNumberOfSeats: true,
          activity: {
            id: true,
            name: true,
            description: true,
            disclaimer: true,
          },
        },
        // relations: {
        //   activity: true,
        // },
      });
    return getPagingData(activitySchedules, size, page);
  }

  // GET ACTIVITY SCHEDULE DETAILS
  async getActivityScheduleDetails(id: UUID): Promise<ActivitySchedule> {
    // VALIDATE ID
    const { error } = validateUuid(id);

    if (error) {
      throw new ValidationError('Invalid ID');
    }

    const activitySchedule = await this.activityScheduleRepository.findOne({
      where: { id },
      relations: {
        activity: true,
      },
    });

    if (!activitySchedule) {
      throw new NotFoundError('Activity Schedule not found');
    }

    return activitySchedule;
  }

  // DELETE ACTIVITY SCHEDULE
  async deleteActivitySchedule(id: UUID): Promise<void> {
    // VALIDATE ID
    const { error } = validateUuid(id);

    if (error) {
      throw new ValidationError('Invalid ID');
    }

    // CHECK IF ACTIVITY SCHEDULE EXISTS
    const activityScheduleExists =
      await this.activityScheduleRepository.findOne({
        where: { id },
        relations: ['activity'],
      });

    // DELETE ACTIVITY SCHEDULE
    const result = await this.activityScheduleRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundError('Activity Schedule not found');
    }

    logger.error(
      `Activity Schedule ${activityScheduleExists?.startTime} - ${activityScheduleExists?.endTime} for ${activityScheduleExists?.activity?.name} has been deleted`
    );
  }

  // UPDATE ACTIVITY SCHEDULE
  async updateActivitySchedule(
    id: UUID,
    {
      startTime,
      endTime,
      description,
      disclaimer,
      activityId,
      numberOfSeats,
      minNumberOfSeats,
      maxNumberOfSeats,
    }: {
      startTime: string;
      endTime: string;
      description: string;
      disclaimer: string;
      activityId: UUID;
      numberOfSeats: number;
      minNumberOfSeats?: number;
      maxNumberOfSeats?: number;
    }
  ): Promise<ActivitySchedule> {
    // VALIDATE ID
    const { error } = validateUuid(id);

    if (error) {
      throw new ValidationError('Invalid ID');
    }

    // CHECK IF ACTIVITY SCHEDULE EXISTS
    const activityScheduleExists =
      await this.activityScheduleRepository.findOne({
        where: { id },
        relations: ['activity'],
      });

    // VALIDATE START AND END TIME
    if (startTime || activityScheduleExists?.startTime) {
      validateStartAndEndTime(
        moment(startTime || activityScheduleExists?.startTime, 'HH:mm:ss'),
        moment(endTime || activityScheduleExists?.endTime, 'HH:mm:ss')
      );
    }

    // UPDATE ACTIVITY SCHEDULE
    const updatedActivitySchedule =
      await this.activityScheduleRepository.update(id, {
        startTime:
          startTime && String(moment(startTime, 'HH:mm:ss').format('HH:mm:ss')),
        endTime:
          endTime && String(moment(endTime, 'HH:mm:ss').format('HH:mm:ss')),
        description,
        disclaimer,
        activityId,
        numberOfSeats,
        minNumberOfSeats,
        maxNumberOfSeats,
      });

    if (!updatedActivitySchedule.affected) {
      throw new NotFoundError('Activity Schedule not found');
    }

    logger.warn(
      `Activity Schedule ${startTime} - ${endTime} for ${activityScheduleExists?.activity?.name} has been updated`
    );

    return updatedActivitySchedule.raw[0];
  }

  // CALCULATE REMAINING SEATS
  async calculateRemainingSeats({
    id,
    date,
  }: {
    id: UUID;
    date: Date;
  }): Promise<number | boolean> {
    // Fetch the activity schedule
    const activitySchedule = await this.activityScheduleRepository.findOne({
      where: { id },
      relations: ['activity'],
    });
    if (!activitySchedule) {
      throw new NotFoundError('Activity schedule not found');
    }

    // Format start and end time
    const startDateTime = new Date(
      moment(
        `${date}T${activitySchedule.startTime}`
      ).format() as unknown as string
    );
    const endDateTime = new Date(
      moment(
        `${date}T${
          activitySchedule?.activity?.slug?.includes('camping')
            ? '23:59:59'
            : activitySchedule.endTime
        }`
      ).format() as unknown as string
    );

    const bookingActivities = await this.bookingActivityRepository
      .createQueryBuilder('bookingActivity')
      .leftJoinAndSelect('bookingActivity.booking', 'booking')
      .where('bookingActivity.activityId = :activityId', {
        activityId: activitySchedule.activityId,
      })
      .andWhere('bookingActivity.startTime <= :startDateTime', {
        startDateTime,
      })
      .andWhere('bookingActivity.endTime >= :endDateTime', { endDateTime })
      .andWhere('booking.status IN (:...status)', {
        status: ['confirmed', 'payment_received'],
      })
      .getMany();

    // Calculate the total number of people (adults + children)
    let totalPeople = 0;

    // FIND SEATS ADJUSTMENTS
    const seatsAdjustments = await this.seatsAdjustmentRepository
      .createQueryBuilder('seatsAdjustment')
      .where('seatsAdjustment.activityScheduleId = :activityScheduleId', {
        activityScheduleId: id,
      })
      .andWhere('seatsAdjustment.startDate <= :date', { date })
      .andWhere('seatsAdjustment.endDate >= :date', { date })
      .orderBy('seatsAdjustment.updatedAt', 'DESC')
      .getMany();

    const numberOfSeats =
      seatsAdjustments?.[0]?.adjustedSeats || activitySchedule.numberOfSeats;

    totalPeople = bookingActivities.reduce((acc, booking) => {
      if (booking.numberOfSeats) {
        return acc + booking.numberOfSeats;
      } else {
        return (
          acc +
          booking.numberOfAdults +
          booking.numberOfChildren
        );
      }
    }, 0);

    return numberOfSeats <= 0 ? 0 : numberOfSeats - totalPeople;
  }
}
