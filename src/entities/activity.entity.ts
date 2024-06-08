import { Column, Entity, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
@Unique(['name', 'description', 'disclaimer'])
export class Activity extends BaseEntity {
  // NAME
  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name!: string;

  // DESCRIPTION
  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  // DISCLAIMER
  @Column({ name: 'disclaimer', type: 'text', nullable: true })
  disclaimer: string;
}
