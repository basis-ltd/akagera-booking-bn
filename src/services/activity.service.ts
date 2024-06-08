import { AppDataSource } from '../data-source';
import { Repository } from 'typeorm';
import { Activity } from '../entities/activity.entity';
import { ValidationError } from '../helpers/errors.helper';

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

    const newActivity = this.activityRepository.create({
      name,
      description,
      disclaimer,
    });

    return this.activityRepository.save(newActivity);
  }
}
