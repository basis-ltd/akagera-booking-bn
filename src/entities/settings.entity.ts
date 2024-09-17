import { Entity, Column } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

@Entity()
export class Settings extends AbstractEntity {
  // USD RATE
  @Column({
    name: 'usd_rate',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    default: 1300,
  })
  usdRate!: number;
}
