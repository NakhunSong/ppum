import { User } from "src/users/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Receipt } from "./receipt.entity";

@Entity()
export class ReceiptItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
  
  @Column()
  price: number;
  
  @Column()
  prices: number;

  @ManyToOne(() => Receipt, receipt => receipt.receiptItems, {
    onDelete: 'CASCADE',
  })
  receipt: Receipt;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];
}