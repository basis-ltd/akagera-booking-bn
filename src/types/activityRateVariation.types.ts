import { ActivityRateVariation } from '../entities/activityRateVariation.entity';
import { Pagination } from '../helpers/pagination.helper';

export interface ActivityRateVariationsPagination extends Pagination {
  rows: ActivityRateVariation[];
}
