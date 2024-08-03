import { ActivitySchedule } from "../entities/activitySchedule.entity";
import { AppDataSource } from "../data-source";
import { UUID } from "crypto";
import { validateStartAndEndTime, validateUuid } from "../helpers/validations.helper";
import { NotFoundError, ValidationError } from "../helpers/errors.helper";
import { Repository } from "typeorm";
import { Activity } from "../entities/activity.entity";
import moment from "moment";
import { getPagination, getPagingData } from "../helpers/pagination.helper";
import { ActivitySchedulesPagination } from "../types/activitySchedule.types";

export class ActivityScheduleService {
  private activityScheduleRepository: Repository<ActivitySchedule>;
  private activityRepository: Repository<Activity>;

  constructor() {
    this.activityScheduleRepository =
      AppDataSource.getRepository(ActivitySchedule);
    this.activityRepository = AppDataSource.getRepository(Activity);
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
    validateStartAndEndTime(moment(startTime, 'HH:mm:ss'), moment(endTime, 'HH:mm:ss'));

    // CREATE ACTIVITY SCHEDULE
    const activitySchedule = this.activityScheduleRepository.create({
      startTime: String(moment(startTime, 'HH:mm:ss').format('HH:mm:ss')),
      endTime: endTime && String(moment(endTime, 'HH:mm:ss').format('HH:mm:ss')),
      description,
      disclaimer,
      activityId,
      numberOfSeats,
      minNumberOfSeats,
      maxNumberOfSeats
    });

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
    
        // DELETE ACTIVITY SCHEDULE
        const result = await this.activityScheduleRepository.delete(id);
    
        if (!result.affected) {
        throw new NotFoundError('Activity Schedule not found');
        }
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
        maxNumberOfSeats
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

      // VALIDATE ACTIVITY ID
      if (!activityId) {
        throw new ValidationError('Activity ID is required');
      }

      const { error: activityIdError } = validateUuid(activityId);

      if (activityIdError) {
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

      // CHECK IF ACTIVITY SCHEDULE EXISTS
      const activityScheduleExists =
        await this.activityScheduleRepository.findOne({
          where: { id },
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
            startTime &&
            String(moment(startTime, 'HH:mm:ss').format('HH:mm:ss')),
          endTime:
            endTime && String(moment(endTime, 'HH:mm:ss').format('HH:mm:ss')),
          description,
          disclaimer,
          activityId,
          numberOfSeats,
          minNumberOfSeats,
          maxNumberOfSeats
        });

      if (!updatedActivitySchedule.affected) {
        throw new NotFoundError('Activity Schedule not found');
      }

      return updatedActivitySchedule.raw[0];
    }
};
