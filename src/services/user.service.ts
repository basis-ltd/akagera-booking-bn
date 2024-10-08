import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { User } from '../entities/user.entity';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../helpers/errors.helper';
import { validateEmail } from '../helpers/validations.helper';
import { comparePasswords, hashPassword } from '../helpers/encryption.helper';
import { generateRandomPassword } from '../helpers/strings.helper';
import {
  newUserCreatedEmailTemplate,
  sendEmail,
} from '../helpers/emails.helper';
import { UUID } from 'crypto';
import { getPagination, getPagingData } from '../helpers/pagination.helper';
import { UserPagination } from '../types/user.types';
import { uploadFile } from '../helpers/uploads.helper';
import logger from '../helpers/logger.helper';

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
      throw new ValidationError('Invalid email address');
    }

    const userExists = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('password')
      .getOne();

    return userExists;
  }

  // CREATE USER
  async createUser({
    email,
    name,
    phone,
    role,
    nationality,
  }: {
    email: string;
    name: string;
    phone: string;
    role: string;
    nationality: string;
  }): Promise<User> {
    // IF EMAIL NOT PROVIDED
    if (!email) {
      throw new ValidationError('Email is required');
    }

    // IF NAME NOT PROVIDED
    if (!name) {
      throw new ValidationError('Name is required');
    }

    // VALIDATE EMAIL
    const { error } = validateEmail(email);

    if (error) {
      throw new ValidationError('Invalid email address');
    }

    // CHECK IF USER EXISTS
    const userExists = await this.findUserByEmail(email);

    if (userExists)
      throw new ConflictError('User with this email address already exists', {
        id: userExists?.id,
      });

    // GENERATE RANDOM PASSWORD
    const password = generateRandomPassword();

    const hashedPassword = await hashPassword(password);

    const newUser = this.userRepository.create({
      email,
      name,
      phone,
      password: hashedPassword,
      role,
      nationality,
    });

    // SEND EMAIL TO USER
    await sendEmail(
      email,
      String(process.env.SENDGRID_SEND_FROM),
      `New account registration - Akagera Booking and Registrations Management System`,
      newUserCreatedEmailTemplate({
        name: newUser?.name,
        email: newUser?.email,
        password: password,
      })
    );

    logger.info(`New user with email ${email} has been added`);

    return this.userRepository.save(newUser);
  }

  // UPDATE USER
  async updateUser({
    id,
    name,
    gender,
    phone,
    role,
  }: {
    id: UUID;
    gender: string;
    name: string;
    phone: string;
    role: string;
  }): Promise<User> {
    const updatedUser = await this.userRepository.update(id, {
      name,
      phone,
      role,
      gender,
    });

    // IF USER NOT FOUND
    if (!updatedUser.affected) {
      throw new NotFoundError('User not found');
    }

    // USER
    const user = await this.userRepository.findOne({ where: { id } });

    logger.info(`User with email ${user?.email} has been updated`);

    return updatedUser.raw[0];
  }

  // FETCH USERS
  async fetchUsers({
    size,
    page,
    condition,
  }: {
    size?: number;
    page?: number;
    condition?: object;
  }): Promise<UserPagination> {
    const { take, skip } = getPagination(page, size);
    const usersList = await this.userRepository.findAndCount({
      where: condition,
      take,
      skip,
      order: { updatedAt: 'DESC' },
    });

    return getPagingData(usersList, size, page);
  }

  // DELETE USER
  async deleteUser(id: UUID): Promise<void> {
    // CHECK IF USER EXISTS
    const userExists = await this.userRepository.findOne({ where: { id } });

    // IF USER DOES NOT EXISTS
    if (!userExists) {
      throw new NotFoundError('User not found');
    }

    await this.userRepository.delete(userExists);

    logger.error(`User with email ${userExists?.email} has been deleted`);
  }

  // UPDATE USER PASSWORD
  async updateUserPassword({
    id,
    existingPassword,
    newPassword,
  }: {
    id: UUID;
    existingPassword: string;
    newPassword: string;
  }): Promise<User> {
    // IF NEW PASSWORD IS SAME AS EXISTING PASSWORD
    if (existingPassword === newPassword) {
      throw new ValidationError(
        'New password cannot be the same as the existing password'
      );
    }

    // GET USER
    const userExists = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'password', 'email'],
    });

    if (!userExists) {
      throw new NotFoundError('User not found');
    }

    // CHECK IF PASSWORD MATCHES
    const passwordMatch = await comparePasswords(
      existingPassword,
      userExists?.password
    );

    if (!passwordMatch) {
      throw new ValidationError('Existing password is incorrect');
    }

    const hashedPassword = await hashPassword(newPassword);

    const updatedUser = await this.userRepository.update(id, {
      password: hashedPassword,
    });

    if (!updatedUser.affected) {
      throw new NotFoundError('User not found');
    }

    logger.info(
      `User with email ${userExists.email} has updated their password`
    );

    return updatedUser.raw[0];
  }

  // GET USER BY ID
  async getUserById(id: UUID): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  // UPDATE USER PHOTO
  async updateUserPhoto({
    id,
    file,
  }: {
    id: UUID;
    file: Express.Multer.File;
  }): Promise<User> {
    const photoUrl = await uploadFile(file, 'akagera-booking');

    const userExists = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'photo'],
    });

    if (!userExists) {
      throw new NotFoundError('User not found');
    }

    userExists.photo = photoUrl;

    return this.userRepository.save(userExists);
  }
}
