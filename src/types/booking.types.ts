import { Booking } from '../entities/booking.entity';
import { Pagination } from '../helpers/pagination.helper';

export interface BookingPagination extends Pagination {
  rows: Booking[];
}
