import { Column, Entity, JoinColumn, JoinTable, ManyToOne } from 'typeorm';
import { AbstractTokenEntity } from './abstract.entity';
import { User } from './user.entity';
import { Booking } from './booking.entity';

@Entity()
export class UserToken extends AbstractTokenEntity {
  // USER ID
  @Column({
    name: 'user_id',
    type: 'uuid',
    nullable: false,
  })
  userId: string;

  // USER
  @ManyToOne(() => User, (user) => user.tokens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

@Entity()
export class BookingToken extends AbstractTokenEntity {
  // BOOKING ID
  @Column({
    name: 'booking_id',
    type: 'uuid',
    nullable: false,
  })
  bookingId: string;

  // BOOKING
  @ManyToOne(() => Booking, (booking) => booking.tokens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;
}
