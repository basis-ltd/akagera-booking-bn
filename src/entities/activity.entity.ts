import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { ActivityRate } from './activityRate.entity';
import { ActivitySchedule } from './activitySchedule.entity';
import { BookingActivity } from './bookingActivity.entity';
import { Service } from './service.entity';

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
  @OneToMany(() => ActivityRate, (activityRate) => activityRate.activity, {
    onDelete: 'CASCADE',
  })
  activityRates: ActivityRate[];

  // SERVICE ID
  @Column({ name: 'service_id', type: 'uuid', nullable: false })
  serviceId!: string;

  // ACTIVITY SCHEDULES
  @OneToMany(
    () => ActivitySchedule,
    (activitySchedule) => activitySchedule.activity
  )
  activitySchedules: ActivitySchedule[];

  // BOOKING ACTIVITIES
  @OneToMany(
    () => BookingActivity,
    (bookingActivity) => bookingActivity.activity,
    { onDelete: 'CASCADE' }
  )
  bookingActivities: BookingActivity[];

  // SERVICE
  @ManyToOne(() => Service, (service) => service.activities)
  @JoinColumn({ name: 'service_id' })
  service: Service;
}
