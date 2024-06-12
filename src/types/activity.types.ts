import { Activity } from '../entities/activity.entity';
import { Pagination } from '../helpers/pagination.helper';

export interface ActivitiesPagination extends Pagination {
  rows: Activity[];
}
