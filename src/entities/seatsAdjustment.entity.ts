import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { UUID } from 'crypto';
import { ActivitySchedule } from './activitySchedule.entity';
import { User } from './user.entity';

@Entity()
export class SeatsAdjustment extends AbstractEntity {
  // ADJUSTED SEATS
  @Column({
    name: 'adjusted_seats',
    type: 'int',
    nullable: false,
  })
  adjustedSeats: number;

  // START DATE
  @Column({
    name: 'start_date',
    type: 'date',
    nullable: false,
  })
  startDate: Date;

  // END DATE
  @Column({
    name: 'end_date',
    type: 'date',
    nullable: false,
  })
  endDate: Date;

  // REASON
  @Column({
    name: 'reason',
    type: 'text',
    nullable: true,
  })
  reason: string;

  // ACTIVITY SCHEDULE ID
  @Column({
    name: 'activity_schedule_id',
    type: 'uuid',
    nullable: false,
  })
  activityScheduleId: UUID;

  // USER ID
  @Column({
    name: 'user_id',
    type: 'uuid',
    nullable: false,
  })
  userId: UUID;

  // ACTIVITY SCHEDULE
  @ManyToOne(
    () => ActivitySchedule,
    (activitySchedule) => activitySchedule.seatsAdjustments
  )
  @JoinColumn({ name: 'activity_schedule_id' })
  activitySchedule: ActivitySchedule;

  // USER
  @ManyToOne(
    () => User,
    (user) => user.seatsAdjustments
  )
  @JoinColumn({ name: 'user_id' })
  user: User;
}
