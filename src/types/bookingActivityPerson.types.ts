import { Pagination } from '../helpers/pagination.helper';
import { BookingActivityPerson } from '../entities/bookingActivityPerson.entity';

export interface BookingActivityPersonPagination extends Pagination {
  rows: BookingActivityPerson[];
}
