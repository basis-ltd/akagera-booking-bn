import { AppDataSource } from '../data-source';
import { DeleteResult, Repository } from 'typeorm';
import { Activity } from '../entities/activity.entity';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../helpers/errors.helper';
import { Pagination, getPagingData } from '../helpers/pagination.helper';
import { ActivitiesPagination } from '../types/activity.types';
import { UUID } from 'crypto';
import { validateUuid } from '../helpers/validations.helper';

export class ActivityService {
  private activityRepository: Repository<Activity>;

  constructor() {
    this.activityRepository = AppDataSource.getRepository(Activity);
  }

  // CREATE ACTIVITY
  async createActivity({
    name,
    description,
    disclaimer,
  }: {
    name: string;
    description: string;
    disclaimer: string;
  }): Promise<Activity> {
    // IF NAME NOT PROVIDED
    if (!name) {
      throw new ValidationError('Name is required');
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
    });

    return this.activityRepository.save(newActivity);
  }

  // UPDATE ACTIVITY
  async updateActivity({
    id,
    name,
    description,
    disclaimer,
  }: {
    id: UUID;
    name: string;
    description: string;
    disclaimer: string;
  }): Promise<Activity> {

    // VALIDATE UUID
    const { error } = validateUuid(id);

    if (error) {
      throw new ValidationError('Invalid activity ID');
    }

    // UPDATE ACTIVITY
    const updatedActivity = await this.activityRepository.update(
      { id },
      { name, description, disclaimer }
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

  // FETCH ACTIVITIES
  async fetchActivities({
    take,
    skip,
    condition = undefined,
  }: {
    take?: number;
    skip?: number;
    condition?: object | undefined;
  }): Promise<ActivitiesPagination> {
    const activities = await this.activityRepository.findAndCount({
      take,
      skip,
      where: condition,
    });

    return getPagingData(activities, take, skip);
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
