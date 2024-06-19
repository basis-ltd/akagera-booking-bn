import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AbstractEntity } from "./base.entity";
import { UUID } from "crypto";
import { Activity } from "./activity.entity";

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

  // NUMBER OF PEOPLE
  @Column({
    name: 'number_of_people',
    type: 'integer',
    nullable: false,
    default: 1,
  })
  numberOfPeople!: number;

  // ACTIVITY
  @ManyToOne(() => Activity, (activity) => activity.bookingActivities)
  @JoinColumn({ name: 'activity_id' })
  activity!: Activity;
};
