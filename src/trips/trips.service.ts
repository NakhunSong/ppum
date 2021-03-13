import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateTripDto } from './dto/create-trip.dto';
import { SelectTripDto } from './dto/select-trip.dto';
import { InviteTripDto } from './dto/update-trip.dto';
import { Trip } from './trip.entity';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(userId: string): Promise<Trip[]> {
    const trips = await this.tripRepository.find({
      where: { user: { id: userId } },
    });
    return trips;
  }

  async find(selectTripDto: SelectTripDto): Promise<Trip> {
    const trip = await this.tripRepository.findOne({
      relations: ['users'],
      where: {
        id: selectTripDto.tripId,
        user: { id: selectTripDto.userId },
      },
    });
    return trip;
  }
  
  async create(createTripDto: CreateTripDto, userId: string) {
    try {
      const trip = new Trip();
      const user = await this.userRepository.findOne({ where: { id: userId } });
      trip.name = createTripDto.name;
      trip.beginDate = createTripDto.beginDate;
      trip.endDate = createTripDto.endDate;
      if (!user) {
        throw new UnauthorizedException();
      }
      trip.user = user;
      await this.tripRepository.save(trip);
    } catch (e) {
      console.error(e);
    }
  }

  async invite(inviteTripDto: InviteTripDto) {
    try {
      const invitee = await this.userRepository.findOne({
        where: { username: inviteTripDto.invitee },
      });
      const trip = await this.tripRepository.findOne({ 
        relations: ['user', 'users'],
        where: { id: inviteTripDto.tripId },
      });
      const tripOwnerId = trip.user.id;
      if (tripOwnerId !== inviteTripDto.userId) {
        throw new UnauthorizedException();
      }
      trip.users = [...trip.users, invitee];
      await this.tripRepository.save(trip);
    } catch (e) {
      console.error(e);
    }
  }
}
