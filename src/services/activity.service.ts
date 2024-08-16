import { AppDataSource } from '../data-source';
import { DeleteResult, Repository } from 'typeorm';
import { Activity } from '../entities/activity.entity';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../helpers/errors.helper';
import { getPagination, getPagingData } from '../helpers/pagination.helper';
import { ActivitiesPagination } from '../types/activity.types';
import { UUID } from 'crypto';
import { validateUuid } from '../helpers/validations.helper';
import { Service } from '../entities/service.entity';

export class ActivityService {
  private activityRepository: Repository<Activity>;
  private serviceRepository: Repository<Service>;

  constructor() {
    this.activityRepository = AppDataSource.getRepository(Activity);
    this.serviceRepository = AppDataSource.getRepository(Service);
  }

  // CREATE ACTIVITY
  async createActivity({
    name,
    serviceId,
    description,
    disclaimer,
  }: {
    name: string;
    serviceId: UUID;
    description: string;
    disclaimer: string;
  }): Promise<Activity> {
    // IF NAME NOT PROVIDED
    if (!name) {
      throw new ValidationError('Name is required');
    }

    // IF SERVICE ID NOT PROVIDED
    if (!serviceId) {
      throw new ValidationError('Service ID is required');
    }
    const { error } = validateUuid(serviceId);
    if (error) {
      throw new ValidationError('Invalid service ID');
    }

    // CHECK IF SERVICE EXISTS
    const serviceExists = await this.serviceRepository.findOne({
      where: { id: serviceId },
    });

    if (!serviceExists) {
      throw new NotFoundError('Service not found');
    }

    // CHECK IF ACTIVITY EXISTS
    const activityExists = await this.activityRepository.findOne({
      where: { name, description },
    });

    if (activityExists) {
      throw new ConflictError(
        'Activity with name and description already exists',
        {
          id: activityExists.id,
        }
      );
    }

    const newActivity = this.activityRepository.create({
      name,
      description,
      disclaimer,
      serviceId,
    });

    return this.activityRepository.save(newActivity);
  }

  // UPDATE ACTIVITY
  async updateActivity({
    id,
    name,
    description,
    disclaimer,
    serviceId,
    slug,
  }: {
    id: UUID;
    name: string;
    description: string;
    disclaimer: string;
    serviceId: UUID;
    slug: string;
  }): Promise<Activity> {
    // VALIDATE UUID
    const { error } = validateUuid(id);

    if (error) {
      throw new ValidationError('Invalid activity ID');
    }

    if (serviceId) {
      // VALIDATE SERVICE ID
      const { error: serviceError } = validateUuid(serviceId);
      if (serviceError) {
        throw new ValidationError('Invalid service ID');
      }

      // CHECK IF SERVICE EXISTS
      const serviceExists = await this.serviceRepository.findOne({
        where: { id: serviceId },
      });

      if (!serviceExists) {
        throw new NotFoundError('Service not found');
      }
    }

    // UPDATE ACTIVITY
    const updatedActivity = await this.activityRepository.update(
      { id },
      { name, description, disclaimer, serviceId, slug }
    );

    // IF ACTIVITY NOT FOUND
    if (!updatedActivity.affected) {
      throw new NotFoundError('Activity not found');
    }

    return updatedActivity.raw[0];
  }

  // FIND ACTIVITY BY ID
  async findActivityById(id: UUID): Promise<Activity> {

    // VALIDATE UUID
    const { error } = validateUuid(id);

    if (error) {
      throw new ValidationError('Invalid activity ID');
    }

    // CHECK IF ACTIVITY EXISTS
    const activityExists = await this.activityRepository.findOne({
      where: { id },
    });

    if (!activityExists) {
      throw new NotFoundError('Activity not found');
    }

    return activityExists;
  }

  // GET ACTIVITY DETAILS
  async getActivityDetails(id: UUID): Promise<Activity> {
    const activityExists = await this.activityRepository.findOne({
      where: { id },
      relations: {
        service: true,
      }
    });

    if (!activityExists) {
      throw new NotFoundError('Activity not found');
    }

    return activityExists;
  }

  // FETCH ACTIVITIES
  async fetchActivities({
    size,
    page,
    condition = undefined,
  }: {
    size?: number;
    page?: number;
    condition?: object | undefined;
  }): Promise<ActivitiesPagination> {
    const { take, skip } = getPagination(page, size);
    const activities = await this.activityRepository.findAndCount({
      take,
      skip,
      where: condition,
      relations: {
        service: true,
        activityRates: true,
        activitySchedules: true,
      },
      order: { name: 'ASC' },
    });

    return getPagingData(activities, size, page);
  }

  // DELETE ACTIVITY
  async deleteActivity(id: UUID): Promise<DeleteResult> {
    // VALIDATE UUID
    const { error } = validateUuid(id);

    if (error) {
      throw new ValidationError('Invalid activity ID');
    }

    // FIND ACTIVITY
    const activityExists = await this.findActivityById(id);

    if (!activityExists) {
      throw new NotFoundError('Activity not found');
    }
    return await this.activityRepository.delete({ id });
  }
}
