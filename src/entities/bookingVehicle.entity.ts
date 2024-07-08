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
    nullable: true,
  })
  plateNumber: string;

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

  // NUMBER OF VEHICLES
  @Column({
    name: 'vehicles_count',
    type: 'int',
    nullable: false,
    default: 1,
  })
  vehiclesCount: number;

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
  @ManyToOne(() => Booking, (booking) => booking.bookingVehicles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'booking_id' })
  booking!: Booking;
}
