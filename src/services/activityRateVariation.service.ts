import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { ActivityRateVariation } from '../entities/activityRateVariation.entity';
import { NotFoundError, ValidationError } from '../helpers/errors.helper';
import { validateUuid } from '../helpers/validations.helper';
import { ActivityRate } from '../entities/activityRate.entity';
import { UUID } from 'crypto';
import { ActivityRateVariationsPagination } from '../types/activityRateVariation.types';
import { getPagingData } from '../helpers/pagination.helper';

export class ActivityRateVariationService {
  private activityRateVariationRepository: Repository<ActivityRateVariation>;
  private activityRateRepository: Repository<ActivityRate>;

  constructor() {
    this.activityRateVariationRepository = AppDataSource.getRepository(
      ActivityRateVariation
    );
    this.activityRateRepository = AppDataSource.getRepository(ActivityRate);
  }

  // CREATE ACTIVITY RATE VARIATION
  async createActivityRateVariation({
    name,
    amountUsd,
    amountRwf,
    description,
    disclaimer,
    activityRateId,
  }: {
    name: string;
    amountUsd: number;
    amountRwf: number;
    description: string;
    disclaimer: string;
    activityRateId: UUID;
  }): Promise<ActivityRateVariation> {
    // VALIDATE ACTIVITY RATE ID
    if (!activityRateId) {
      throw new ValidationError('Activity Rate ID is required');
    }

    const { error } = validateUuid(activityRateId);

    if (error) {
      throw new ValidationError('Invalid Activity Rate ID');
    }

    // IF AMOUNT USD NOT PROVIDED
    if (!amountUsd) {
      throw new ValidationError('Amount USD is required');
    }

    // CHECK IF ACTIVITY RATE EXISTS
    const activityRateExists = await this.activityRateRepository.findOne({
      where: { id: activityRateId },
    });

    // IF ACTIVITY RATE DOES NOT EXIST
    if (!activityRateExists) {
      throw new NotFoundError('Activity rate not found');
    }

    const newActivityRateVariation =
      this.activityRateVariationRepository.create({
        name: name || activityRateExists.name,
        amountUsd,
        amountRwf,
        description,
        disclaimer,
        activityRateId,
      });

    return this.activityRateVariationRepository.save(newActivityRateVariation);
  }

  // FETCH ACTIVITY RATE VARIATIONS
  async fetchActivityRateVariations({
    take,
    skip,
    condition,
  }: {
    take: number;
    skip: number;
    condition: object | undefined;
  }): Promise<ActivityRateVariationsPagination> {
    const activityRateVariations =
      await this.activityRateVariationRepository.findAndCount({
        where: condition,
        take,
        skip,
        relations: {
          activityRate: true,
        },
      });

    return getPagingData(activityRateVariations, take, skip);
  }

  // GET ACTIVITY RATE VARIATION BY ID
  async findActivityRateVariationById(
    id: UUID
  ): Promise<ActivityRateVariation> {
    // IF ID NOT PROVIDED
    if (!id) {
      throw new ValidationError('Activity Rate Variation ID is required');
    }

    // VALIDATE UUID
    const { error } = validateUuid(id);

    if (error) {
      throw new ValidationError('Invalid Activity Rate Variation ID');
    }

    // FIND ACTIVITY RATE VARIATION
    const activityRateVariation =
      await this.activityRateVariationRepository.findOne({
        where: { id },
      });

    // IF ACTIVITY RATE VARIATION NOT FOUND
    if (!activityRateVariation) {
      throw new NotFoundError('Activity Rate Variation not found');
    }

    return activityRateVariation;
  }

  // GET ACTIVITY RATE VARIATION DETAILS
  async getActivityRateVariationDetails(
    id: UUID
  ): Promise<ActivityRateVariation> {
    // IF ID NOT PROVIDED
    if (!id) {
      throw new ValidationError('Activity Rate Variation ID is required');
    }

    // VALIDATE UUID
    const { error } = validateUuid(id);

    if (error) {
      throw new ValidationError('Invalid Activity Rate Variation ID');
    }

    // FIND ACTIVITY RATE VARIATION
    const activityRateVariation =
      await this.activityRateVariationRepository.findOne({
        where: { id },
        relations: ['activityRate', 'activityRate.activity'],
      });

    // IF ACTIVITY RATE VARIATION NOT FOUND
    if (!activityRateVariation) {
      throw new NotFoundError('Activity Rate Variation not found');
    }

    return activityRateVariation;
  }

  // UPDATE ACTIVITY RATE VARIATION
  async updateActivityRateVariation({
    id,
    name,
    amountUsd,
    amountRwf,
    description,
    disclaimer,
    activityRateId,
  }: {
    id: UUID;
    name: string;
    amountUsd: number;
    amountRwf: number;
    description: string;
    disclaimer: string;
    activityRateId: UUID;
  }): Promise<ActivityRateVariation> {
    // IF ID NOT PROVIDED
    if (!id) {
      throw new ValidationError('Activity Rate Variation ID is required');
    }

    // VALIDATE UUID
    const { error } = validateUuid(id);

    if (error) {
      throw new ValidationError('Invalid Activity Rate Variation ID');
    }

    // VALIDATE ACTIVITY RATE ID IF PROVIDED
    if (activityRateId) {
      const { error } = validateUuid(activityRateId);

      if (error) {
        throw new ValidationError('Invalid Activity Rate ID');
      }

      // CHECK IF ACTIVITY RATE EXISTS
      const activityRateExists = await this.activityRateRepository.findOne({
        where: { id: activityRateId },
      });

      // IF ACTIVITY RATE DOES NOT EXIST
      if (!activityRateExists) {
        throw new NotFoundError('Activity rate not found');
      }
    }

    // UPDATE ACTIVITY RATE VARIATION
    const updatedActivityRateVariation = await this.activityRateVariationRepository.update(id, {
      name,
      amountUsd,
      amountRwf,
      description,
      disclaimer,
      activityRateId,
    });

    // IF ACTIVITY RATE VARIATION NOT FOUND
    if (!updatedActivityRateVariation.affected) {
      throw new NotFoundError('Activity Rate Variation not found');
    }

    return updatedActivityRateVariation.raw[0];
  }

  // DELETE ACTIVITY RATE VARIATION
  async deleteActivityRateVariation(id: UUID): Promise<ActivityRateVariation> {
    // IF ID NOT PROVIDED
    if (!id) {
      throw new ValidationError('Activity Rate Variation ID is required');
    }

    // VALIDATE UUID
    const { error } = validateUuid(id);

    if (error) {
      throw new ValidationError('Invalid Activity Rate Variation ID');
    }

    // FIND ACTIVITY RATE VARIATION
    const activityRateVariation =
      await this.activityRateVariationRepository.findOne({
        where: { id },
      });

    // IF ACTIVITY RATE VARIATION NOT FOUND
    if (!activityRateVariation) {
      throw new NotFoundError('Activity Rate Variation not found');
    }

    // DELETE ACTIVITY RATE VARIATION
    await this.activityRateVariationRepository.delete(id);

    return activityRateVariation;
  }
}
