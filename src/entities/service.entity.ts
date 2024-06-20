import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from './base.entity';
import { Activity } from './activity.entity';

@Entity()
export class Service extends AbstractEntity {
  // NAME
  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name!: string;

  // DESCRIPTION
  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  description: string;

  // POSITION
  @Column({
    name: 'position',
    type: 'int',
    nullable: false,
    default: 0,
  })
  position!: number;

  // ACTIVITIES
  @OneToMany(() => Activity, (activity) => activity.service, {
    onDelete: 'CASCADE',
  })
  activities: Activity[];
}
