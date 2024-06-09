import { AppDataSource } from '../data-source';
import { ActivityRate } from '../entities/activityRate';
import { Repository } from 'typeorm';
import { NotFoundError, ValidationError } from '../helpers/errors.helper';
import { validateUuid } from '../helpers/validations.helper';
import { UUID } from 'crypto';
import { ActivityService } from './activity.service';
import { ActivityRatesPagination } from '../types/activityRate.types';
import { getPagingData } from '../helpers/pagination.helper';

export class ActivityRateService {
  private activityRateRepository: Repository<ActivityRate>;
  private activityService: ActivityService;

  constructor() {
    this.activityRateRepository = AppDataSource.getRepository(ActivityRate);
    this.activityService = new ActivityService();
  }

  // CREATE ACTIVITY RATE
  async createActivityRate({
    name,
    amountUsd,
    amountRwf,
    description,
    disclaimer,
    activityId,
  }: {
    name: string;
    amountUsd: number;
    amountRwf: number;
    description: string;
    disclaimer: string;
    activityId: UUID;
  }): Promise<ActivityRate> {
    // IF AMOUNT USD NOT PROVIDED
    if (!amountUsd) {
      throw new ValidationError('Amount in USD is required');
    }

    // VALIDATE ACTIVITY ID
    if (!activityId) {
      throw new ValidationError('Activity ID is required');
    }
    const { error } = validateUuid(activityId);

    if (error) {
      throw new ValidationError('Invalid activity ID');
    }

    // CHECK IF ACTIVITY EXISTS
    const activity = await this.activityService.findActivityById(activityId);

    if (!activity) {
      throw new NotFoundError('Activity not found');
    }

    const newActivityRate = this.activityRateRepository.create({
      name: name || activity.name,
      amountUsd,
      amountRwf,
      description,
      disclaimer,
      activityId,
    });

    return this.activityRateRepository.save(newActivityRate);
  }

  // FETCH ACTIVITY RATES
  async fetchActivityRates({
    take,
    skip,
    condition = undefined,
  }: {
    take?: number;
    skip?: number;
    condition?: object | undefined;
  }): Promise<ActivityRatesPagination> {
    const activityRates = await this.activityRateRepository.find({
      take,
      skip,
      where: condition,
    });

    return getPagingData(activityRates, take, skip);
  }

  // GET ACTIVITY RATE BY ID
  async findActivityRateById(id: UUID): Promise<ActivityRate> {
    // VALIDATE UUID
    const { error } = validateUuid(id);

    if (error) {
      throw new ValidationError('Invalid activity rate ID');
    }

    // CHECK IF ACTIVITY RATE EXISTS
    const activityRate = await this.activityRateRepository.findOne({
      where: { id },
    });

    if (!activityRate) {
      throw new NotFoundError('Activity rate not found');
    }

    return activityRate;
  }

  // UPDATE ACTIVITY RATE
  async updateActivityRate({
    id,
    name,
    amountUsd,
    amountRwf,
    description,
    disclaimer,
  }: {
    id: UUID;
    name: string;
    amountUsd: number;
    amountRwf: number;
    description: string;
    disclaimer: string;
  }): Promise<ActivityRate> {

    // IF ACTIVITY RATE ID NOT PROVIDED 
    if (!id) {
      throw new ValidationError('Activity rate ID is required');
    }

    // VALIDATE UUID
    const { error } = validateUuid(id);

    if (error) {
      throw new ValidationError('Invalid activity rate ID');
    }

    // IF ACTIVITY ID IS PROVIDED
    const activityExists = await this.findActivityRateById(id);

    if (!activityExists) {
      throw new NotFoundError('Activity rate not found');
    }

    // UPDATE ACTIVITY RATE
    const updatedActivityRate = await this.activityRateRepository.update(id, {
      name,
      amountUsd,
      amountRwf,
      description,
      disclaimer,
    });

    if (!updatedActivityRate) {
      throw new NotFoundError('Activity rate not found');
    }

    return updatedActivityRate.raw[0];
  }

  // DELETE ACTIVITY RATE
  async deleteActivityRate(id: UUID): Promise<ActivityRate> {
    // VALIDATE UUID
    const { error } = validateUuid(id);

    if (error) {
      throw new ValidationError('Invalid activity rate ID');
    }

    // CHECK IF ACTIVITY RATE EXISTS
    const activityRate = await this.findActivityRateById(id);

    if (!activityRate) {
      throw new NotFoundError('Activity rate not found');
    }

    // DELETE ACTIVITY RATE
    await this.activityRateRepository.delete(id);

    return activityRate;
  }
}
