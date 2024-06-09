import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Activity } from "./activity.entity";
import { UUID } from "crypto";

@Entity()

export class ActivityRate extends BaseEntity {

    // NAME
    @Column({
        name: 'name',
        type: 'varchar',
        length: 255,
        nullable: false
    })
    name!: string;

    // AMOUNT IN USD
    @Column({
        name: 'amount_usd',
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: false
    })
    amountUsd!: number;

    // AMOUNT IN RWF
    @Column({
        name: 'amount_rwf',
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true
    })
    amountRwf: number;

    // DESCRIPTION
    @Column({
        name: 'description',
        type: 'text',
        nullable: true
    })
    description: string;

    // DISCLAIMER
    @Column({
        name: 'disclaimer',
        type: 'text',
        nullable: true
    })
    disclaimer: string;

    // ACTIVITY ID
    @Column({
        name: 'activity_id',
        type: 'uuid',
        nullable: false
    })
    activityId!: UUID;

    // ACTIVITY
    @ManyToOne(() => Activity, (activity) => activity.activityRates)
    @JoinColumn({ name: 'activity_id' })
    activity: Activity;
};
