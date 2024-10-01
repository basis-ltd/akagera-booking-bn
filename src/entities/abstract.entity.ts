import { UUID } from 'crypto';
import moment from 'moment';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { COUNTRIES } from '../constants/countries.constants';
import { IsNotEmpty } from 'class-validator';
import { TOKEN_TYPES } from '../constants/auth.constants';

export abstract class AbstractEntity {
  // ID
  @PrimaryGeneratedColumn('uuid')
  id!: UUID;

  // CREATED AT
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  // UPDATED AT
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;
}

export class AbstractUserEntity extends AbstractEntity {
  // GENDER
  @Column({
    name: 'gender',
    type: 'enum',
    nullable: false,
    default: 'M',
    enum: ['M', 'F'],
  })
  gender!: string;

  // NATIONALITY
  @Column({
    name: 'nationality',
    type: 'enum',
    nullable: false,
    default: 'RW',
    enum: COUNTRIES.map((country) => country.code),
  })
  nationality!: string;

  // RESIDENCE
  @Column({
    name: 'residence',
    type: 'enum',
    nullable: true,
    default: 'RW',
    enum: COUNTRIES.map((country) => country.code),
  })
  residence: string;

  // DATE OF BIRTH
  @Column({
    name: 'date_of_birth',
    type: 'date',
    nullable: false,
    default: moment().subtract(18, 'years').format('YYYY-MM-DD'),
  })
  dateOfBirth: Date;

  // NAME
  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  // PHONE
  @Column({ name: 'phone', type: 'varchar', length: 255, nullable: true })
  phone: string;
}

export class AbstractTokenEntity extends AbstractEntity {
  // TOKEN
  @Column({
    name: 'token',
    type: 'varchar',
    nullable: false,
  })
  token: string;

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
}
