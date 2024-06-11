import { Column, Entity, ManyToOne } from 'typeorm';
import { BOOKING_STATUS } from '../constants/booking.constants';
import { UUID } from 'crypto';
import moment from 'moment';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Booking extends BaseEntity {
  // START DATE
  @Column({ name: 'start_date', type: 'timestamp', nullable: false })
  startDate!: Date;

  // END DATE
  @Column({
    name: 'end_date',
    type: 'timestamp',
    nullable: true
  })
  endDate: Date;

  // NAME
  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name!: string;

  // NOTES
  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string;

  // CREATED BY
  @Column({ name: 'created_by', type: 'varchar', length: 255, nullable: false })
  createdBy!: string;

  // APPROVED BY
  @Column({ name: 'approved_by', type: 'uuid', nullable: true })
  approvedBy: UUID;

  // APPROVED AT
  @Column({ name: 'approved_at', type: 'timestamp', nullable: true })
  approvedAt: Date;

  // STATUS
  @Column({
    type: 'enum',
    enum: Object.values(BOOKING_STATUS),
    default: BOOKING_STATUS.IN_PROGRESS,
  })
  status!: string;

  // REFERENCE ID
  @Column({
    name: 'reference_id',
    type: 'varchar',
    nullable: false,
    default: `BK-${moment().format('HHss')}-${moment().format('x').slice(-4)}`,
  })
  referenceId!: string;

  // TOTAL AMOUNT USD
  @Column({
    name: 'total_amount_usd',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  totalAmountUsd: number;

  // TOTAL AMOUNT RWF
  @Column({
    name: 'total_amount_rwf',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  totalAmountRwf: number;

  // DISCOUNTED AMOUNT USD
  @Column({
    name: 'discounted_amount_usd',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  discountedAmountUsd: number;

  // DISCOUNTED AMOUNT RWF
  @Column({
    name: 'discounted_amount_rwf',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  discountedAmountRwf: number;

  // CHECK IN
  @Column({
    name: 'check_in',
    type: 'timestamp',
    nullable: true,
  })
  checkIn: Date;

  // CHECK OUT
  @Column({
    name: 'check_out',
    type: 'timestamp',
    nullable: true,
  })
  checkOut: Date;

  // APPROVED BY
  @ManyToOne(() => User, (user) => user.bookingsApproved)
  approvedByUser: User;

}
