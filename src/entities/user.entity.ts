import { IsEmail, IsNotEmpty } from 'class-validator';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { ROLES } from '../constants/auth.constants';
import { AbstractUserEntity } from './abstract.entity';
import { Booking } from './booking.entity';
import { SeatsAdjustment } from './seatsAdjustment.entity';
import { UserToken } from './token.entity';

@Entity()
@Unique(['phone', 'email'])
export class User extends AbstractUserEntity {
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

  // PHOTO
  @Column({
    name: 'photo',
    type: 'varchar',
    nullable: true,
  })
  photo: string;

  // BOOKINGS APPROVED
  @OneToMany(() => Booking, (booking) => booking.approvedByUser)
  bookingsApproved: Booking[];

  // TOKENS
  @OneToMany(() => UserToken, (userToken) => userToken.user)
  tokens: UserToken[];

  // SEATS ADJUSTMENTS
  @OneToMany(() => SeatsAdjustment, (seatsAdjustment) => seatsAdjustment.user)
  seatsAdjustments: SeatsAdjustment[];
}
