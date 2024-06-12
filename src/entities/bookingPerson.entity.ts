import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractUserEntity } from './base.entity';
import { UUID } from 'crypto';
import { Booking } from './booking.entity';

@Entity()
export class BookingPerson extends AbstractUserEntity {
  // BOOKING ID
  @Column({ name: 'booking_id', type: 'uuid', nullable: false })
  bookingId!: UUID;

  // EMAIL
  @Column({ name: 'email', type: 'varchar', length: 255, nullable: true })
  email: string;

  // BOOKING
  @ManyToOne(() => Booking, (booking) => booking.bookingPeople)
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;
}
