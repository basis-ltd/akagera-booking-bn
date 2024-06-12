import { BookingVehicle } from '../entities/bookingVehicle.entity';
import { Pagination } from '../helpers/pagination.helper';

export interface BookingVehiclesPagination extends Pagination {
  rows: BookingVehicle[];
}
