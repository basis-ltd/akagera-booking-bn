import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractUserEntity } from './abstract.entity';
import { UUID } from 'crypto';
import { Booking } from './booking.entity';
import { ACCOMODATION_OPTION } from '../constants/booking.constants';
import { BookingActivityPerson } from './bookingActivityPerson.entity';

@Entity()
export class BookingPerson extends AbstractUserEntity {
  // BOOKING ID
  @Column({ name: 'booking_id', type: 'uuid', nullable: false })
  bookingId!: UUID;

  // EMAIL
  @Column({ name: 'email', type: 'varchar', length: 255, nullable: true })
  email: string;

  // START DATE
  @Column({ name: 'start_date', type: 'timestamp', nullable: false })
  startDate!: Date;

  // END DATE
  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  endDate: Date;

  // ACCOMODATION
  @Column({
    name: 'accomodation',
    type: 'enum',
    enum: Object.values(ACCOMODATION_OPTION),
    nullable: true,
  })
  accomodation: string;

  // BOOKING
  @ManyToOne(() => Booking, (booking) => booking.bookingPeople)
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  // BOOKING ACTIVITY PEOPLE
  @OneToMany(
    () => BookingActivityPerson,
    (bookingActivityPerson) => bookingActivityPerson.bookingPerson,
    { onDelete: 'CASCADE' }
  )
  bookingActivityPeople!: BookingActivityPerson[];
}
