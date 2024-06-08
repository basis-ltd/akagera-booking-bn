import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { User } from '../entities/user.entity';

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  // GET USER BY EMAIL
  async findUserByEmail(email: string): Promise<User | null> {
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      const userExists = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .addSelect('password')
        .getOne();

      if (!userExists) {
        return null;
      }

      return userExists;
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }
}