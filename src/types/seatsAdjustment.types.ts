import { SeatsAdjustment } from "../entities/seatsAdjustment.entity";
import { Pagination } from "../helpers/pagination.helper";

export interface SeatsAdjustmentPagination extends Pagination {
    rows: SeatsAdjustment[];
}