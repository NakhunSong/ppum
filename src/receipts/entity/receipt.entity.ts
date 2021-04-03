import { TripDate } from "src/trip-dates/trip-date.entity";
import { Trip } from "src/trips/trip.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Location } from "../interface/receipts.interface";
import { ReceiptItem } from "./receipt-item.entity";

@Entity()
export class Receipt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'json' })
  location: Location;

  @Column()
  name: string;

  @OneToMany(() => ReceiptItem, receiptItem => receiptItem.receipt)
  receiptItems: ReceiptItem[];
  
  @Column()
  prices: number;

  @ManyToOne(() => Trip, trip => trip.receipts)
  trip: Trip;

  @ManyToOne(() => TripDate, tripDate => tripDate.receipts)
  tripDate: TripDate;
}