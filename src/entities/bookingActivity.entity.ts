import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "./abstract.entity";
import { UUID } from "crypto";
import { Activity } from "./activity.entity";
import { Booking } from "./booking.entity";
import { BookingActivityPerson } from "./bookingActivityPerson.entity";

@Entity()
export class BookingActivity extends AbstractEntity {
  // START TIME
  @Column({ name: 'start_time', type: 'timestamp', nullable: false })
  startTime!: Date;

  // END TIME
  @Column({ name: 'end_time', type: 'timestamp', nullable: true })
  endTime: Date;

  // BOOKING ID
  @Column({ name: 'booking_id', type: 'uuid', nullable: false })
  bookingId!: UUID;

  // ACTIVITY ID
  @Column({ name: 'activity_id', type: 'uuid', nullable: false })
  activityId!: UUID;

  // NUMBER OF ADULTS
  @Column({
    name: 'number_of_adults',
    type: 'integer',
    nullable: false,
    default: 0,
  })
  numberOfAdults!: number;

  // NUMBER OF CHILDREN
  @Column({
    name: 'number_of_children',
    type: 'integer',
    nullable: false,
    default: 0,
  })
  numberOfChildren!: number;

  // ACTIVITY
  @ManyToOne(() => Activity, (activity) => activity.bookingActivities)
  @JoinColumn({ name: 'activity_id' })
  activity!: Activity;

  // BOOKING
  @ManyToOne(() => Booking, (booking) => booking.bookingActivities)
  @JoinColumn({ name: 'booking_id' })
  booking!: Booking;

  // BOOKING ACTIVITY PEOPLE
  @OneToMany(
    () => BookingActivityPerson,
    (bookingActivityPerson) => bookingActivityPerson.bookingActivity,
    { onDelete: 'CASCADE' }
  )
  bookingActivityPeople!: BookingActivityPerson[];
};
