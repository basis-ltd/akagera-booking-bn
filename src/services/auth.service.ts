import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { User } from '../entities/user.entity';
import { comparePasswords, hashPassword } from '../helpers/encryption.helper';
import { NotFoundError, ValidationError } from '../helpers/errors.helper';
import { validateEmail } from '../helpers/validations.helper';

export class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  // SIGNUP
  async signup({
    email,
    name,
    phone,
    password,
    role,
  }: {
    email: string;
    name: string;
    phone: string;
    password: string;
    role: string;
  }): Promise<User> {
    // IF EMAIL NOT PROVIDED
    if (!email) {
      throw new ValidationError('Email is required');
    }

    // IF NAME NOT PROVIDED
    if (!name) {
      throw new ValidationError('Name is required');
    }

    // IF PHONE NOT PROVIDED
    if (!password) {
      throw new ValidationError('Password is required');
    }

    // VALIDATE EMAIL
    const { error } = validateEmail(email);

    if (error) {
      throw new ValidationError('Invalid email address');
    }

    const hashedPassword = await hashPassword(password);

    const newUser = this.userRepository.create({
      email,
      name,
      phone,
      password: hashedPassword,
      role,
    });

    return this.userRepository.save(newUser);
  }

  // LOGIN
  async login({ email, password }: { email: string; password: string }) {
    // IF EMAIL NOT PROVIDED
    if (!email) {
      throw new Error('Email is required');
    }

    // IF PASSWORD NOT PROVIDED
    if (!password) {
      throw new Error('Password is required');
    }

    // VALIDATE EMAIL
    const { error } = validateEmail(email);

    if (error) {
      throw new Error('Invalid email address');
    }

    const userExists = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.email',
        'user.name',
        'user.phone',
        'user.password',
        'user.role',
      ])
      .where('user.email = :email', { email })
      .getOne();

    if (!userExists) {
      throw new NotFoundError('User not found');
    }

    const isPasswordMatch = await comparePasswords(
      password,
      userExists.password
    );

    if (!isPasswordMatch) {
      throw new ValidationError('Email or password is incorrect');
    }

    return userExists;
  }
}
