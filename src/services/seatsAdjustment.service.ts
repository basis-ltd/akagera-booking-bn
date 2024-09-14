import { AppDataSource } from '../data-source';
import { Repository } from 'typeorm';
import { SeatsAdjustment } from '../entities/seatsAdjustment.entity';
import { ActivitySchedule } from '../entities/activitySchedule.entity';
import { UUID } from 'crypto';
import { NotFoundError, ValidationError } from '../helpers/errors.helper';
import { SeatsAdjustmentPagination } from '../types/seatsAdjustment.types';
import { getPagination, getPagingData } from '../helpers/pagination.helper';

export class SeatsAdjustmentService {
  private seatsAdjustmentRepository: Repository<SeatsAdjustment>;
  private activityScheduleRepository: Repository<ActivitySchedule>;

  constructor() {
    this.seatsAdjustmentRepository =
      AppDataSource.getRepository(SeatsAdjustment);
    this.activityScheduleRepository =
      AppDataSource.getRepository(ActivitySchedule);
  }

  // CREATE SEATS ADJUSTMENT
  async createSeatsAdjustment({
    adjustedSeats,
    startDate,
    endDate,
    reason,
    activityScheduleId,
    userId,
  }: {
    adjustedSeats: number;
    startDate: Date;
    endDate: Date;
    reason?: string;
    activityScheduleId: UUID;
    userId: UUID;
  }): Promise<SeatsAdjustment> {
    // IF ADJUSTED SEATS NOT PROVIDED
    if (!adjustedSeats) {
      throw new ValidationError('Adjusted seats is required');
    }

    // IF START DATE NOT PROVIDED
    if (!startDate) {
      throw new ValidationError('Start date is required');
    }

    // IF END DATE NOT PROVIDED
    if (!endDate) {
      throw new ValidationError('End date is required');
    }

    // IF ACTIVITY SCHEDULE ID NOT PROVIDED
    if (!activityScheduleId) {
      throw new ValidationError('Activity schedule ID is required');
    }

    // IF USER ID NOT PROVIDED
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    // CHECK IF ACTIVITY SCHEDULE ID IS VALID
    const activitySchedule = await this.activityScheduleRepository.findOne({
      where: { id: activityScheduleId },
    });

    if (!activitySchedule) {
      throw new NotFoundError('Activity schedule not found');
    }

    // CREATE SEATS ADJUSTMENT
    const seatsAdjustment = this.seatsAdjustmentRepository.create({
      adjustedSeats,
      startDate,
      endDate,
      reason,
      activityScheduleId,
      userId,
    });

    await this.seatsAdjustmentRepository.save(seatsAdjustment);

    return seatsAdjustment;
  }

  // FETCH SEATS ADJUSTMENTS
  async fetchSeatsAdjustments({
    page,
    size,
    condition,
  }: {
    page: number;
    size: number;
    condition?: object;
  }): Promise<SeatsAdjustmentPagination> {
    const { take, skip } = getPagination(page, size);

    const seatsAdjustments = await this.seatsAdjustmentRepository.findAndCount({
      where: condition,
      take,
      skip,
    });

    return getPagingData(seatsAdjustments, size, page);
  }
}
