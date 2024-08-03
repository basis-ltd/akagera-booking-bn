import { Payment } from '../entities/payment.entity';
import { Pagination } from '../helpers/pagination.helper';

export interface PaymentPagination extends Pagination {
  rows: Payment[];
}
