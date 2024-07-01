import { User } from '../entities/user.entity';
import { Pagination } from '../helpers/pagination.helper';

export interface UserPagination extends Pagination {
  rows: User[];
}
