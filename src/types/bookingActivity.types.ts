import { BookingActivity } from '../entities/bookingActivity.entity';
import { Pagination } from '../helpers/pagination.helper';

export interface BookingActivityPagination extends Pagination {
  rows: BookingActivity[];
}
