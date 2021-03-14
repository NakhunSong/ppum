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

  @OneToMany(() => TripDate, tripDate => tripDate.trip)
  tripDate: TripDate;
  
  @ManyToOne(() => User, user => user.trip, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToMany(type => User, user => user.trips)
  @JoinTable()
  users: User[];
}