import { UUID } from 'crypto';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Booking } from './booking.entity';
import { COUNTRIES } from '../constants/countries.constants';

@Entity()
export class BookingVehicle extends AbstractEntity {
  // PLATE NUMBER
  @Column({
    name: 'plate_number',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  plateNumber!: string;

  // BOOKING ID
  @Column({ name: 'booking_id', type: 'uuid', nullable: false })
  bookingId: UUID;

  // VEHICLE TYPE
  @Column({
    name: 'vehicle_type',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  vehicleType!: string;

  // REGISTRATION COUNTRY
  @Column({
    name: 'registration_country',
    type: 'enum',
    nullable: false,
    enum: COUNTRIES.map((country) => country.code),
    default: 'RW',
  })
  registrationCountry!: string;

  // BOOKING
  @ManyToOne(() => Booking, (booking) => booking.bookingVehicles)
  @JoinColumn({ name: 'booking_id' })
  booking!: Booking;
}
