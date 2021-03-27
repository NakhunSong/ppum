import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Receipt } from "./receipt.entity";

@Entity()
export class ReceiptItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
  
  @Column()
  price: number;

  @ManyToOne(() => Receipt, receipt => receipt.receiptItems)
  receipt: Receipt;
}