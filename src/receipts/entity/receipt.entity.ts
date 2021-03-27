import { TripDate } from "src/trip-dates/trip-date.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Location } from "../interface/receipts.interface";
import { ReceiptItem } from "./receiptItem.entity";

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
  totalPrices: number;

  @ManyToOne(() => TripDate, tripDate => tripDate.receipts)
  tripDate: TripDate;
}