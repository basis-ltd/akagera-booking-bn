import { AppDataSource } from '../data-source';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { NotFoundError, ValidationError } from '../helpers/errors.helper';
import { PaymentPagination } from '../types/payment.types';
import { getPagination, getPagingData } from '../helpers/pagination.helper';
import { UUID } from 'crypto';
import { xml2js, js2xml } from 'xml-js';
import axios from 'axios';

// LOAD ENVIROMENT VARIABLES
const {
  PAYMENT_REDIRECT_URL,
} = process.env;

export class PaymentService {
  private paymentRepository: Repository<Payment>;

  constructor() {
    this.paymentRepository = AppDataSource.getRepository(Payment);
  }

  private parseXmlResponse(xmlResponse: string): any {
    return xml2js(xmlResponse, { compact: true, ignoreComment: true });
  }

  private prepareXmlPayload(
    amount: number,
    currency: string,
    paymentId: string,
    RedirectURL: string
  ): string {
    const payload = {
      API3G: {
        CompanyToken: '8D3DA73D-9D7F-4E09-96D4-3D44E7A83EA3',
        Request: 'createToken',
        Transaction: {
          PaymentAmount: amount.toFixed(2),
          PaymentCurrency: currency,
          CompanyRef: paymentId,
          RedirectURL,
          CompanyRefUnique: '1',
          PTL: '24',
        },
        Services: {
          Service: {
            ServiceType: '3978',
            ServiceDescription: 'Booking Akagera Activities',
            ServiceDate:
              new Date().toISOString().split('T')[0].replace(/-/g, '/') +
              ' 19:00',
          },
        },
      },
    };

    return js2xml(payload, { compact: true, ignoreComment: true, spaces: 4 });
  }

  private prepareVerificationXml(transactionToken: string): string {
    const payload = {
      API3G: {
        CompanyToken: '8D3DA73D-9D7F-4E09-96D4-3D44E7A83EA3',
        Request: 'verifyToken',
        TransactionToken: transactionToken,
        VerifyTransaction: 1
      },
    };

    return js2xml(payload, { compact: true, ignoreComment: true, spaces: 4 });
  }

  private parseXmlVerificationResponse(xmlResponse: string): any {
    const jsonResponse = xml2js(xmlResponse, {
      compact: true,
      ignoreComment: true,
    });
    const api3g = (
      jsonResponse as {
        API3G: { [key: string]: { _text: string } };
      }
    ).API3G;

    return {
      Result: api3g.Result?._text,
      ResultExplanation: api3g.ResultExplanation?._text,
      CustomerName: api3g.CustomerName?._text,
      CustomerCredit: api3g.CustomerCredit?._text,
      CustomerCreditType: api3g.CustomerCreditType?._text,
      TransactionApproval: api3g.TransactionApproval?._text,
      TransactionCurrency: api3g.TransactionCurrency?._text,
      TransactionAmount: api3g.TransactionAmount?._text,
      FraudAlert: api3g.FraudAlert?._text,
      FraudExplanation: api3g.FraudExplnation?._text,
      TransactionNetAmount: api3g.TransactionNetAmount?._text,
      TransactionSettlementDate: api3g.TransactionSettlementDate?._text,
      TransactionRollingReserveAmount:
        api3g.TransactionRollingReserveAmount?._text,
      TransactionRollingReserveDate: api3g.TransactionRollingReserveDate?._text,
      CustomerPhone: api3g.CustomerPhone?._text,
      CustomerCountry: api3g.CustomerCountry?._text,
      CustomerAddress: api3g.CustomerAddress?._text,
      CustomerCity: api3g.CustomerCity?._text,
      CustomerZip: api3g.CustomerZip?._text,
      MobilePaymentRequest: api3g.MobilePaymentRequest?._text,
      AccRef: api3g.AccRef?._text,
      TransactionFinalCurrency: api3g.TransactionFinalCurrency?._text,
      TransactionFinalAmount: api3g.TransactionFinalAmount?._text,
    };
  }

  // CREATE PAYMENT
  async createPayment({
    email,
    amount,
    currency,
    bookingId,
  }: {
    email: string;
    amount: number;
    currency: string;
    bookingId: string;
  }) {
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
    const newPayment = await this.paymentRepository.save({
      email,
      amount,
      currency,
      bookingId,
      status: 'PENDING',
    });

    // Prepare XML payload
    const xmlPayload = this.prepareXmlPayload(
      amount,
      currency,
      newPayment.id.toString(),
      `${PAYMENT_REDIRECT_URL}`
    );
    const response = await axios.post(
      'https://secure.3gdirectpay.com/API/v6/',
      xmlPayload,
      {
        headers: { 'Content-Type': 'application/xml' },
      }
    );

    // Parse XML response
    const jsonResponse = this.parseXmlResponse(response.data);

    if (jsonResponse.API3G.Result._text !== '000') {
      await this.paymentRepository.delete(newPayment?.id);
      throw new ValidationError(jsonResponse.API3G.ResultExplanation._text);
    }

    // SAVE PAYMENT
    newPayment.transactionId = jsonResponse.API3G.TransToken._text;

    this.paymentRepository.save(newPayment);

    return {
      ...newPayment,
      redirectUrl: generateRedirectUrl(jsonResponse),
    };
  }

  // UPDATE PAYMENT
  async updatePayment({
    id,
    status,
    transactionId,
    approvalCode,
  }: {
    id: UUID;
    status: string;
    transactionId?: string;
    approvalCode?: string;
  }) {
    // IF NO PAYMENT ID
    if (!id) {
      throw new ValidationError('Payment ID is required');
    }

    // IF NO STATUS
    if (!status) {
      throw new ValidationError('Status is required');
    }

    // FIND PAYMENT
    const paymentExists = await this.paymentRepository.findOne({
      where: { id },
    });

    if (!paymentExists) {
      throw new NotFoundError('Payment not found');
    }

    // UPDATE PAYMENT
    const updatedPayment = this.paymentRepository.merge(paymentExists, {
      transactionId,
      status,
      approvalCode,
    });

    // SAVE PAYMENT
    return this.paymentRepository.save(updatedPayment);
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
    transactionToken,
  }: {
    id: UUID;
    transactionToken: string;
  }): Promise<Payment> {
    // IF NO PAYMENT ID
    if (!id) {
      throw new ValidationError('Payment ID is required');
    }

    // IF NO TRANSACTION TOKEN
    if (!transactionToken) {
      throw new ValidationError('Transaction Token is required');
    }

    // FIND PAYMENT
    const payment = await this.paymentRepository.findOne({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    // Prepare XML payload
    const xmlPayload = this.prepareVerificationXml(transactionToken);

    // Verify transaction
    const response = await axios.post(
      'https://secure.3gdirectpay.com/API/v6/',
      xmlPayload,
      {
        headers: { 'Content-Type': 'application/xml' },
      }
    );

    // Parse XML response
    const jsonResponse = this.parseXmlVerificationResponse(response.data);

    // SAVE PAYMENT
    return jsonResponse;
  }
}

interface APIResponse {
  API3G: {
    Result: { _text: string };
    ResultExplanation: { _text: string };
    TransToken: { _text: string };
    TransRef: { _text: string };
  };
}

function generateRedirectUrl(apiResponse: APIResponse): string {
  const baseUrl = 'https://secure.3gdirectpay.com/dpopayment.php';
  const token = apiResponse.API3G.TransToken._text;
  const redirectUrl = `${baseUrl}?ID=${token}`;

  return redirectUrl;
}
