import { Column, Entity } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { generateOTP } from '../helpers/auth.helper';

@Entity()
export class Payment extends AbstractEntity {
  // PAYMENT ID
  @Column({
    name: 'payment_id',
    type: 'int',
    nullable: false,
    default: generateOTP(8),
  })
  paymentId!: number;

  // EMAIL
  @Column({
    name: 'email',
    type: 'varchar',
    nullable: false,
  })
  email!: string;

  // AMOUNT
  @Column({
    name: 'amount',
    type: 'int',
    nullable: false,
  })
  amount!: number;

  // CURRENCY
  @Column({
    name: 'currency',
    type: 'varchar',
    nullable: false,
    default: 'USD',
  })
  currency!: string;

  // BOOKING ID
  @Column({
    name: 'booking_id',
    type: 'uuid',
    nullable: false,
  })
  bookingId!: string;

  // STATUS
  @Column({
    name: 'status',
    type: 'enum',
    nullable: false,
    default: 'PENDING',
    enum: ['PENDING', 'PAID', 'FAILED', 'CONFIRMED'],
  })
  status!: string;

  // PAYMENT INTEND ID
    @Column({
        name: 'payment_intent_id',
        type: 'varchar',
        nullable: true,
    })
    paymentIntentId: string;
}
