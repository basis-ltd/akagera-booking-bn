import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import {
  ACCOMODATION_OPTION,
  BOOKING_STATUS,
  EXIT_GATE,
} from '../constants/booking.constants';
import { UUID } from 'crypto';
import { AbstractEntity } from './abstract.entity';
import { User } from './user.entity';
import { BookingPerson } from './bookingPerson.entity';
import { BookingVehicle } from './bookingVehicle.entity';
import { BookingActivity } from './bookingActivity.entity';
import { BookingToken } from './token.entity';
import { Payment } from './payment.entity';

@Entity()
export class Booking extends AbstractEntity {
  // START DATE
  @Column({ name: 'start_date', type: 'date', nullable: false })
  startDate!: Date;

  // END DATE
  @Column({
    name: 'end_date',
    type: 'date',
    nullable: true,
  })
  endDate: Date;

  // TYPE
  @Column({
    name: 'type',
    type: 'enum',
    enum: ['booking', 'registration'],
    default: 'booking',
    nullable: false,
  })
  type!: string;

  // NAME
  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name!: string;

  // NOTES
  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string;

  // EMAIL
  @Column({ name: 'email', type: 'varchar', length: 255, nullable: true })
  email: string;

  // PHONE
  @Column({ name: 'phone', type: 'varchar', length: 255, nullable: true })
  phone: string;

  // APPROVED BY
  @Column({ name: 'approved_by', type: 'uuid', nullable: true })
  approvedBy: UUID;

  // APPROVED AT
  @Column({ name: 'approved_at', type: 'timestamp', nullable: true })
  approvedAt: Date;

  // EXIT GATE
  @Column({
    name: 'exit_gate',
    type: 'enum',
    enum: Object.values(EXIT_GATE),
    nullable: true,
  })
  exitGate: string;

  // ENTRY GATE
  @Column({
    name: 'entry_gate',
    type: 'enum',
    enum: Object.values(EXIT_GATE),
    nullable: true,
  })
  entryGate: string;

  // ACCOMODATION
  @Column({
    name: 'accomodation',
    type: 'enum',
    enum: Object.values(ACCOMODATION_OPTION),
    nullable: true,
  })
  accomodation: string;

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

  // CONSENT
  @Column({
    name: 'consent',
    type: 'boolean',
    default: false,
  })
  consent: boolean;

  // APPROVED BY
  @ManyToOne(() => User, (user) => user.bookingsApproved)
  approvedByUser: User;

  // BOOKING PEOPLE
  @OneToMany(() => BookingPerson, (bookingPerson) => bookingPerson.booking)
  bookingPeople: BookingPerson[];

  // BOOKING VEHICLES
  @OneToMany(() => BookingVehicle, (bookingVehicle) => bookingVehicle.booking)
  bookingVehicles: BookingVehicle[];

  // BOOKING ACTIVITIES
  @OneToMany(
    () => BookingActivity,
    (bookingActivity) => bookingActivity.booking
  )
  bookingActivities: BookingActivity[];

  // TOKENS
  @OneToMany(() => BookingToken, (bookingToken) => bookingToken.booking)
  tokens: BookingToken[];

  // PAYMENTS
  @OneToMany(() => Payment, (payment) => payment.booking)
  payments: Payment[];
}
