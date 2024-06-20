import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AbstractEntity } from "./abstract.entity";
import { Activity } from "./activity.entity";

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
    @ManyToOne(() => Activity, (activity) => activity.activitySchedules)
    @JoinColumn({ name: 'activity_id' })
    activity: Activity;
};
