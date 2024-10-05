import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { generateOTP } from '../helpers/auth.helper';
import { Booking } from './booking.entity';

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

  @Column({
    name: 'transaction_id',
    type: 'varchar',
    nullable: true,
  })
  transactionId: string;

  @Column({
    name: 'approval_code',
    type: 'varchar',
    nullable: true,
  })
  approvalCode: string;

  // BOOKING
  @ManyToOne(() => Booking, (booking) => booking.payments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'booking_id' })
  booking!: Booking;
}
