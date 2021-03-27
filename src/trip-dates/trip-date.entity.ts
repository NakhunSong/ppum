import { Receipt } from 'src/receipts/entity/receipt.entity';
import { Trip } from 'src/trips/trip.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TripDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: string;

  @OneToMany(() => Receipt, receipt => receipt.tripDate)
  receipts: Receipt[];

  @ManyToOne(() => Trip, trip => trip.tripDate)
  trip: Trip;
}