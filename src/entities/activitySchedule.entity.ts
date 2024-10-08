import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "./abstract.entity";
import { Activity } from "./activity.entity";
import { SeatsAdjustment } from "./seatsAdjustment.entity";

@Entity()
export class ActivitySchedule extends AbstractEntity {

    // START TIME
    @Column({
        name: 'start_time',
        type: 'time',
        nullable: false,
    })
    startTime!: string;

    // END TIME
    @Column({
        name: 'end_time',
        type: 'time',
        nullable: true,
    })
    endTime: string;

    // DESCRIPTION
    @Column({
        name: 'description',
        type: 'text',
        nullable: true,
    })
    description: string;

    // MINIMUM NUMBER OF SEATS
    @Column({
        name: 'min_number_of_seats',
        type: 'int',
        nullable: true,
    })
    minNumberOfSeats?: number;

    // MAXIMUM NUMBER OF SEATS
    @Column({
        name: 'max_number_of_seats',
        type: 'int',
        nullable: true,
    })
    maxNumberOfSeats?: number;

    // NUMBER OF SEATS
    @Column({
        name: 'number_of_seats',
        type: 'int',
        nullable: true,
    })
    numberOfSeats: number;

    // DISCLAIMER
    @Column({
        name: 'disclaimer',
        type: 'text',
        nullable: true,
    })
    disclaimer: string;

    // ACTIVITY ID
    @Column({
        name: 'activity_id',
        type: 'uuid',
        nullable: false,
    })
    activityId!: string;

    // ACTIVITY
    @ManyToOne(() => Activity, (activity) => activity.activitySchedules, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'activity_id' })
    activity: Activity;

    // SEATS ADJUSTMENTS
    @OneToMany(() => SeatsAdjustment, (seatsAdjustment) => seatsAdjustment.activitySchedule)
    seatsAdjustments: SeatsAdjustment[];
};
