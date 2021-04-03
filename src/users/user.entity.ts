import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Trip } from 'src/trips/trip.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;
  
  @Column()
  displayname: string;

  @Column()
  password: string;

  @OneToMany(() => Trip, trip => trip.user)
  trip: Trip[];

  @ManyToMany(() => Trip, trip => trip.users)
  trips: Trip[];

  // @ManyToMany(() => ReceiptItem, receiptItem => receiptItem.users)
  // receiptItems: ReceiptItem[];
}