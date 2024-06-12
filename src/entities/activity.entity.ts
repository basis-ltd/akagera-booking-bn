import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { AbstractEntity } from './base.entity';
import { ActivityRate } from './activityRate.entity';
import { ActivitySchedule } from './activitySchedule.entity';
import { BookingActivity } from './bookingActivity.entity';

@Entity()
@Unique(['name', 'description', 'disclaimer'])
export class Activity extends AbstractEntity {
  // NAME
  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name!: string;

  // DESCRIPTION
  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  // DISCLAIMER
  @Column({ name: 'disclaimer', type: 'text', nullable: true })
  disclaimer: string;

  // ACTIVITY RATES
  @OneToMany(() => ActivityRate, (activityRate) => activityRate.activity)
  activityRates: ActivityRate[];

  // ACTIVITY SCHEDULES
  @OneToMany(
    () => ActivitySchedule,
    (activitySchedule) => activitySchedule.activity
  )
  activitySchedules: ActivitySchedule[];

  // BOOKING ACTIVITIES
  @OneToMany(
    () => BookingActivity,
    (bookingActivity) => bookingActivity.activity
  )
  bookingActivities: BookingActivity[];
}
