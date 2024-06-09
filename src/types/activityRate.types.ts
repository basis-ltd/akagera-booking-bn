import { ActivityRate } from "../entities/activityRate.entity";
import { Pagination } from "../helpers/pagination.helper";

export interface ActivityRatesPagination extends Pagination {
  rows: ActivityRate[];
}
