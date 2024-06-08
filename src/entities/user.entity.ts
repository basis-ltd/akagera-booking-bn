import { IsEmail, IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { ROLES } from '../constants/auth.constant';
import { COUNTRIES } from '../constants/countries.constant';
import moment from 'moment';

@Entity()
@Unique(['phone', 'email'])
export class User {
  // ID
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // EMAIL
  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  @IsEmail({}, { message: 'Invalid email address' })
  email!: string;

  // NAME
  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  // PHONE
  @Column({ name: 'phone', type: 'varchar', length: 255, nullable: true })
  phone: string;

  // PASSWORD
  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    nullable: false,
    select: false,
  })
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;

  // ROLE
  @Column({
    name: 'role',
    type: 'enum',
    nullable: false,
    default: ROLES.RECEPTIONIST,
    enum: Object.values(ROLES),
  })
  role!: string;

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

  // PHOTO
  @Column({
    name: 'photo',
    type: 'varchar',
    nullable: true,
  })
  photo: string;

  // GENDER
  @Column({
    name: 'gender',
    type: 'enum',
    nullable: false,
    default: 'M',
    enum: ['M', 'F'],
  })
  gender!: string;

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
