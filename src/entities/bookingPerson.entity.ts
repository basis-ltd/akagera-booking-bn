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

  // ACCOMODATION
  @Column({
    name: 'accomodation',
    type: 'enum',
    enum: Object.values(ACCOMODATION_OPTION),
    nullable: true,
  })
  accomodation: string;

  // BOOKING
  @ManyToOne(() => Booking, (booking) => booking.bookingPeople, {
    onDelete: 'CASCADE',
  })
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
