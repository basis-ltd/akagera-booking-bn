import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { UUID } from 'crypto';
import { BookingActivity } from './bookingActivity.entity';
import { BookingPerson } from './bookingPerson.entity';

@Entity()
export class BookingActivityPerson extends AbstractEntity {
  // BOOKING ACTIVITY ID
  @Column({ name: 'booking_activity_id', type: 'uuid', nullable: false })
  bookingActivityId: UUID;

  // BOOKING PERSON ID
  @Column({ name: 'booking_person_id', type: 'uuid', nullable: false })
  bookingPersonId: UUID;

  // BOOKING ACTIVITY
  @ManyToOne(
    () => BookingActivity,
    (bookingActivity) => bookingActivity.bookingActivityPeople, {
      onDelete: 'CASCADE'
    }
  )
  @JoinColumn({ name: 'booking_activity_id' })
  bookingActivity: BookingActivity;

  // BOOKING PERSON
  @ManyToOne(
    () => BookingPerson,
    (bookingPerson) => bookingPerson.bookingActivityPeople, {
      onDelete: 'CASCADE'
    }
  )
  @JoinColumn({ name: 'booking_person_id' })
  bookingPerson: BookingPerson;
}
