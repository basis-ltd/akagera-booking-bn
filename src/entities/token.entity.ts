import { Column, Entity, JoinColumn, JoinTable, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { User } from './user.entity';
import { TOKEN_TYPES } from '../constants/auth.constants';

@Entity()
export class Token extends AbstractEntity {
  // TOKEN
  @Column({
    name: 'token',
    type: 'varchar',
    nullable: false,
  })
  token: string;

  // USER ID
  @Column({
    name: 'user_id',
    type: 'uuid',
    nullable: false,
  })
  userId: string;

  // TYPE
  @Column({
    name: 'type',
    type: 'enum',
    enum: Object.values(TOKEN_TYPES),
    default: TOKEN_TYPES.AUTH,
  })
  type: string;

  // EXPIRES AT
  @Column({
    name: 'expires_at',
    type: 'timestamp',
    nullable: false,
  })
  expiresAt: Date;

  // USER
  @ManyToOne(() => User, (user) => user.tokens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
