import { Receipt } from 'src/receipts/entity/receipt.entity';
import { TripDate } from 'src/trip-dates/trip-date.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column()
  name: string;

  @Column()
  beginDate: string;

  @Column()
  endDate: string;

  @OneToMany(() => Receipt, receipt => receipt.trip)
  receipts: Receipt[];

  @OneToMany(() => TripDate, tripDate => tripDate.trip)
  tripDates: TripDate[];

  @ManyToOne(() => User, user => user.trip, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToMany(type => User, user => user.trips)
  @JoinTable()
  users: User[];
}