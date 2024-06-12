import { BookingPerson } from '../entities/bookingPerson.entity';
import { Pagination } from '../helpers/pagination.helper';

export interface BookingPersonsPagination extends Pagination {
  rows: BookingPerson[];
}
