import { User } from 'src/users/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToOne(() => User, user => user.trip, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToMany(type => User, user => user.trips)
  @JoinTable()
  users: User[];
}