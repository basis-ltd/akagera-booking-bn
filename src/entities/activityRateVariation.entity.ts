import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AbstractEntity } from "./base.entity";
import { ActivityRate } from "./activityRate.entity";

@Entity()
export class ActivityRateVariation extends AbstractEntity {
  // NAME
  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name!: string;

  // AMOUNT USD
  @Column({ name: 'amount_usd', type: 'decimal', precision: 10, scale: 2, nullable: false })
  amountUsd!: number;

  // AMOUNT RWF
    @Column({ name: 'amount_rwf', type: 'decimal', precision: 10, scale: 2, nullable: true })
  amountRwf: number;

  // DESCRIPTION
    @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  // DISCLAIMER
    @Column({ name: 'disclaimer', type: 'text', nullable: true })
  disclaimer: string;

  // ACTIVITY RATE ID
    @Column({ name: 'activity_rate_id', type: 'uuid', nullable: false })
    activityRateId: string;

  // ACTIVITY RATE
  @ManyToOne(() => ActivityRate, (activityRate) => activityRate.activityRateVariations)
  @JoinColumn({ name: 'activity_rate_id' })
  activityRate: ActivityRate;
}