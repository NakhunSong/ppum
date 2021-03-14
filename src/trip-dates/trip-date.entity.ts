import { Trip } from 'src/trips/trip.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TripDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: string;

  @ManyToOne(() => Trip, trip => trip.tripDate)
  trip: Trip;
}