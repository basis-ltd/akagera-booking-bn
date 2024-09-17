import { AppDataSource } from '../data-source';
import { Repository } from 'typeorm';
import { SeatsAdjustment } from '../entities/seatsAdjustment.entity';
import { ActivitySchedule } from '../entities/activitySchedule.entity';
import { UUID } from 'crypto';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../helpers/errors.helper';
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

    // CHECK IF SEATS ADJUSTMENT ALREADY EXISTS FOR THE SAME ACTIVITY SCHEDULE ID AND OVERLAPPING DATES
    const existingSeatsAdjustment = await this.seatsAdjustmentRepository
      .createQueryBuilder('seatsAdjustment')
      .where('seatsAdjustment.activityScheduleId = :activityScheduleId', {
        activityScheduleId,
      })
      .andWhere('seatsAdjustment.startDate <= :endDate', { endDate })
      .andWhere('seatsAdjustment.endDate >= :startDate', { startDate })
      .getOne();

    if (existingSeatsAdjustment) {
      throw new ConflictError(
        'Seats adjustment with overlapping dates already exists',
        {
          startDate: existingSeatsAdjustment?.startDate,
          endDate: existingSeatsAdjustment?.endDate,
        }
      );
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
      relations: {
        activitySchedule: true,
        user: true,
      },
    });

    return getPagingData(seatsAdjustments, size, page);
  }

  // UPDATE SEATS ADJUSTMENT
  async updateSeatsAdjustment({
    id,
    adjustedSeats,
    startDate,
    endDate,
    reason,
  }: {
    id: UUID;
    adjustedSeats: number;
    startDate: Date;
    endDate: Date;
    reason: string;
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

    // IF REASON NOT PROVIDED
    if (!reason) {
      throw new ValidationError('Reason is required');
    }

    // CHECK IF SEATS ADJUSTMENT EXISTS
    const seatsAdjustment = await this.seatsAdjustmentRepository.findOne({
      where: { id },
    });

    if (!seatsAdjustment) {
      throw new NotFoundError('Seats adjustment not found');
    }

    // UPDATE SEATS ADJUSTMENT
    const updatedSeatsAdjustment = await this.seatsAdjustmentRepository.save({
      ...seatsAdjustment,
      adjustedSeats,
      startDate,
      endDate,
      reason,
    });

    return updatedSeatsAdjustment;
  }

  // DELETE SEATS ADJUSTMENT
  async deleteSeatsAdjustment(id: UUID): Promise<void> {
    // CHECK IF SEATS ADJUSTMENT EXISTS
    const seatsAdjustment = await this.seatsAdjustmentRepository.findOne({
      where: { id },
    });

    if (!seatsAdjustment) {
      throw new NotFoundError('Seats adjustment not found');
    }

    // DELETE SEATS ADJUSTMENT
    await this.seatsAdjustmentRepository.delete(id);
  }
}
