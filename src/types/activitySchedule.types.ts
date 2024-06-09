import { ActivitySchedule } from '../entities/activitySchedule.entity';
import { Pagination } from '../helpers/pagination.helper';

export interface ActivitySchedulesPagination extends Pagination {
  rows: ActivitySchedule[];
}
