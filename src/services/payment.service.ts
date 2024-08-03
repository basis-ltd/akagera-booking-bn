import { AppDataSource } from "../data-source";
import Stripe from "stripe";
import { Repository } from "typeorm";
import { Payment } from "../entities/payment.entity";
import { NotFoundError, ValidationError } from "../helpers/errors.helper";
import { PaymentPagination } from "../types/payment.types";
import { getPagination, getPagingData } from "../helpers/pagination.helper";
import { UUID } from "crypto";

// LOAD ENVIROMENT VARIABLES
const { STRIPE_SECRET_KEY } = process.env

// INITIALIZE STRIPE
const stripePay = new Stripe(String(STRIPE_SECRET_KEY));

export class PaymentService {
  private paymentRepository: Repository<Payment>;

  constructor() {
    this.paymentRepository = AppDataSource.getRepository(Payment);
  }

  // CREATE PAYMENT
  async createPayment({
    email,
    amount,
    currency,
    bookingId,
    paymentIntentId,
  }: {
    email: string;
    amount: number;
    currency: string;
    bookingId: string;
    paymentIntentId?: string;
  }): Promise<Payment> {
    // IF NO USER ID
    if (!email) {
      throw new ValidationError('Email is required');
    }

    // IF NO AMOUNT
    if (!amount) {
      throw new ValidationError('Amount is required');
    }

    // IF NO CURRENCY
    if (!currency) {
      throw new ValidationError('Currency is required');
    }

    // IF NO BOOKING ID
    if (!bookingId) {
      throw new ValidationError('Booking ID is required');
    }

    // CREATE PAYMENT
    const newPayment = this.paymentRepository.create({
      email,
      amount,
      currency,
      bookingId,
      status: 'PENDING',
      paymentIntentId: paymentIntentId,
    });

    // SAVE PAYMENT
    return this.paymentRepository.save(newPayment);
  }

  // CREATE PAYMENT INTENT
    async createPaymentIntent({
        amount,
        currency,
    }: {
        amount: number;
        currency: string;
    }): Promise<any> {
        // CREATE PAYMENT INTENT
        return stripePay.paymentIntents.create({
        amount: Number(amount) * 100,
        currency: currency?.toLowerCase(),
        automatic_payment_methods: {
            enabled: true,
        },
        });
    }

  // UPDATE PAYMENT
  async updatePayment({
    paymentIntentId,
    status,
  }: {
    paymentIntentId: string;
    status: string;
  }): Promise<Payment> {
    // IF NO PAYMENT ID
    if (!paymentIntentId) {
      throw new ValidationError('Payment ID is required');
    }

    // IF NO STATUS
    if (!status) {
      throw new ValidationError('Status is required');
    }

    // FIND PAYMENT
    const payment = await this.paymentRepository.findOne({
      where: { paymentIntentId },
    });

    // IF NO PAYMENT
    if (!payment) {
      throw new ValidationError('Payment not found');
    }

    // UPDATE PAYMENT
    payment.status = status;

    // SAVE PAYMENT
    return this.paymentRepository.save(payment);
  }

  // FETCH PAYMENTS
  async fetchPayments({
    size,
    page,
    condition,
  }: {
    size?: number;
    page?: number;
    condition?: object;
  }): Promise<PaymentPagination> {
    // GET LIMIT AND OFFSET
    const { take, skip } = getPagination(page, size);

    // FETCH PAYMENTS
    const payments = await this.paymentRepository.findAndCount({
      where: condition,
      take,
      skip,
    });

    return getPagingData(payments, size, page);
  }

  // CONFIRM PAYMENT
  async confirmPayment({
    id,
  }: {
    id: UUID;
  }): Promise<Payment> {
    // IF NO PAYMENT ID
    if (!id) {
      throw new ValidationError('Payment ID is required');
    }

    // FIND PAYMENT
    const payment = await this.paymentRepository.findOne({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    // UPDATE PAYMENT
    payment.status = 'CONFIRMED';

    // SAVE PAYMENT
    return this.paymentRepository.save(payment);
  }
}
