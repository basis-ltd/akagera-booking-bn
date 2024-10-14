import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { User } from '../entities/user.entity';
import { comparePasswords, hashPassword } from '../helpers/encryption.helper';
import { NotFoundError, ValidationError } from '../helpers/errors.helper';
import { validateEmail } from '../helpers/validations.helper';
import { UserToken } from '../entities/token.entity';
import { generateOTP } from '../helpers/auth.helper';
import moment from 'moment';
import { loginOtpEmailTemplate, resetPasswordEmailTemplate, sendEmail } from '../helpers/emails.helper';
import logger from '../helpers/logger.helper';
import jwt from 'jsonwebtoken';

export class AuthService {
  private userRepository: Repository<User>;
  private userTokenRepository: Repository<UserToken>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.userTokenRepository = AppDataSource.getRepository(UserToken);
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

    logger.info(`New user with email ${email} signed up`);

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
        'user.name',
      ])
      .where('user.email = :email', { email })
      .getOne();

    if (!userExists) {
      throw new NotFoundError('Email or password is incorrect');
    }

    const isPasswordMatch = await comparePasswords(
      password,
      userExists.password
    );

    if (!isPasswordMatch) {
      throw new ValidationError('Email or password is incorrect');
    }

    // GENERATE OTP IF USER IS ADMIN
    if (userExists?.role === 'admin') {
      // GENERATE OTP
      const otp = generateOTP();

      // DELETE EXISTING TOKENS
      await this.userTokenRepository.delete({
        userId: userExists?.id,
        type: 'auth',
      });

      // CREATE TOKEN
      const token = this.userTokenRepository.create({
        token: otp.toString(),
        userId: userExists?.id,
        type: 'auth',
        expiresAt: moment().add(10, 'minutes').toDate(),
      });

      await this.userTokenRepository.save(token);

      // SEND EMAIL WITH OTP
      await sendEmail(
        userExists?.email,
        String(process.env.SENDGRID_SEND_FROM),
        `Two Factor Authentication for ${userExists?.name}`,
        loginOtpEmailTemplate({
          name: userExists?.name,
          otp,
        })
      );

      logger.info(
        `${userExists?.name} with email ${userExists?.email} tried to login`
      );
    }

    return userExists;
  }

  // VERIFY AUTH
  async verifyAuth({ email, otp }: { email: string; otp: string }) {
    // IF EMAIL NOT PROVIDED
    if (!email) {
      throw new ValidationError('Email is required');
    }

    // IF OTP NOT PROVIDED
    if (!otp) {
      throw new ValidationError('OTP is required');
    }

    // VALIDATE EMAIL
    const { error } = validateEmail(email);

    if (error) {
      throw new ValidationError('Invalid email address');
    }

    const userExists = await this.userRepository.findOne({ where: { email } });

    if (!userExists) {
      throw new NotFoundError('User not found');
    }

    const tokenExists = await this.userTokenRepository.findOne({
      where: {
        userId: userExists.id,
        token: otp,
        type: 'auth',
      },
    });

    // IF TOKEN DOES NOT EXIST
    if (!tokenExists) {
      logger.error(
        `Invalid OTP for ${userExists.name} with email ${userExists.email}`
      );
      throw new ValidationError('Invalid OTP');
    }

    // CHECK IF TOKEN IS NOT EXPIRED
    if (moment(tokenExists?.expiresAt).format() < moment().format()) {
      throw new ValidationError('Token has expired. Please request a new one');
    }

    // DELETE TOKEN
    await this.userTokenRepository.delete({
      userId: userExists.id,
      type: 'auth',
    });

    logger.info(
      `${userExists.name} with email ${userExists.email} logged in successfully`
    );

    return userExists;
  }

  // REQUEST OTP
  async requestLoginOTP({ email }: { email: string }) {
    // IF EMAIL NOT PROVIDED
    if (!email) {
      throw new Error('Email is required');
    }

    // VALIDATE EMAIL
    const { error } = validateEmail(email);

    if (error) {
      throw new Error('Invalid email address');
    }

    const userExists = await this.userRepository.findOne({ where: { email } });

    if (!userExists) {
      throw new NotFoundError('User not found');
    }

    // GENERATE OTP
    const otp = generateOTP();

    // DELETE EXISTING TOKENS
    await this.userTokenRepository.delete({
      userId: userExists.id,
      type: 'auth',
    });

    // CREATE TOKEN
    const token = this.userTokenRepository.create({
      token: otp.toString(),
      userId: userExists.id,
      type: 'auth',
      expiresAt: moment().add(10, 'minutes').toDate(),
    });

    await this.userTokenRepository.save(token);

    // SEND EMAIL WITH OTP
    await sendEmail(
      userExists.email,
      String(process.env.SENDGRID_SEND_FROM),
      `Two Factor Authentication for ${userExists.name}`,
      loginOtpEmailTemplate({
        name: userExists.name,
        otp,
      })
    );

    return true;
  }

  // RESET PASSWORD
  async requestResetPassword({ email }: { email: string }) {
    // IF EMAIL NOT PROVIDED
    if (!email) {
      throw new ValidationError('Email is required');
    }

    // VALIDATE EMAIL
    const { error } = validateEmail(email);

    if (error) {
      throw new ValidationError('Invalid email address');
    }

    const userExists = await this.userRepository.findOne({ where: { email } });

    if (!userExists) {
      throw new NotFoundError('User not found');
    }

    // GENERATE OTP
    const otp = generateOTP();

    // DELETE EXISTING TOKENS
    await this.userTokenRepository.delete({
      userId: userExists.id,
      type: 'auth',
    });
    

    // CREATE TOKEN
    const token = this.userTokenRepository.create({
      token: otp.toString(),
      userId: userExists.id,
      type: 'auth',
      expiresAt: moment().add(10, 'minutes').toDate(),
    });

    await this.userTokenRepository.save(token);

    // SEND EMAIL WITH OTP
    await sendEmail(
      userExists?.email,
      String(process.env.SENDGRID_SEND_FROM),
      `Reset Password for ${userExists?.name}`,
      resetPasswordEmailTemplate({
        name: userExists?.name,
        otp,
      })
    );
    

    return true;
  }

  // VERIFY PASSWORD RESET
  async verifyPasswordReset({ email, otp }: { email: string; otp: string }): Promise<{ token: string }> {
    // IF EMAIL NOT PROVIDED
    if (!email) {
      throw new ValidationError('Email is required');
    }

    // IF OTP NOT PROVIDED
    if (!otp) {
      throw new ValidationError('OTP is required');
    }

    // VALIDATE EMAIL
    const { error } = validateEmail(email);

    if (error) {
      throw new ValidationError('Invalid email address');
    }

    const userExists = await this.userRepository.findOne({ where: { email } });

    if (!userExists) {
      throw new NotFoundError('User not found');
    }

    const tokenExists = await this.userTokenRepository.findOne({
      where: {
        userId: userExists.id,
        token: otp,
        type: 'auth',
      },
    });

    // IF TOKEN DOES NOT EXIST
    if (!tokenExists) {
      logger.error(
        `Invalid OTP for ${userExists.name} with email ${userExists.email}`
      );
      throw new ValidationError('Invalid OTP');
    }

    // CHECK IF TOKEN IS NOT EXPIRED
    if (moment(tokenExists?.expiresAt).format() < moment().format()) {
      throw new ValidationError('Token has expired. Please request a new one');
    }

    // DELETE TOKEN
    await this.userTokenRepository.delete({
      userId: userExists.id,
      type: 'auth',
    });

    // GENERATE TOKEN
    const token = jwt.sign(
      { id: userExists.id, email: userExists.email, role: userExists.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: '1h',
      }
    );

   return { token };

  }

  // RESET PASSWORD
  async resetPassword({ email, password }: { email: string; password: string }) {
    // IF EMAIL NOT PROVIDED
    if (!email) {
      throw new ValidationError('Email is required');
    }
    
    // IF PASSWORD NOT PROVIDED
    if (!password) {
      throw new ValidationError('Password is required');
    }

    // CHECK IF USER EXISTS
    const userExists = await this.userRepository.findOne({ where: { email } });

    if (!userExists) {
      throw new NotFoundError('User not found');
    }

    const hashedPassword = await hashPassword(password);

    await this.userRepository.update({ id: userExists.id }, { password: hashedPassword });
    
   
    return true;
  }
}
