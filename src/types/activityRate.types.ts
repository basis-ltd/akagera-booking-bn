import { ActivityRate } from "../entities/activityRate";
import { Pagination } from "../helpers/pagination.helper";

export interface ActivityRatesPagination extends Pagination {
  rows: ActivityRate[];
}
