import { Service } from '../entities/service.entity';
import { Pagination } from '../helpers/pagination.helper';

export interface ServicePagination extends Pagination {
  rows: Service[];
}
