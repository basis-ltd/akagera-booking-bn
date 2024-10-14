import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { UUID } from 'crypto';
import { User } from './user.entity';

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

  // ADMIN EMAIL
  @Column({
    name: 'admin_email',
    type: 'varchar',
    length: 255,
    nullable: false,
    default: 'akagera@africanparks.org',
  })
  adminEmail!: string;

  // USER ID
  @Column({
    name: 'user_id',
    type: 'uuid',
    nullable: true,
  })
  userId!: UUID;

  // USER
  @ManyToOne(() => User, (user) => user.settings, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
