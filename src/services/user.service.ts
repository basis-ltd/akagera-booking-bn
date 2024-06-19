import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { User } from '../entities/user.entity';
import { ConflictError, NotFoundError, ValidationError } from '../helpers/errors.helper';
import { validateEmail } from '../helpers/validations.helper';

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  // GET USER BY EMAIL
  async findUserByEmail(email: string): Promise<User | null> {

    // IF EMAIL NOT PROVIDED
      if (!email) {
        throw new ValidationError('Email is required');
      }

      // VALIDATE EMAIL
      const { error } = validateEmail(email);
      if (error) {
        throw new ValidationError("Invalid email address");
      }

      const userExists = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .addSelect('password')
        .getOne();

      return userExists;
  }
};
