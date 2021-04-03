import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTripDatesDto } from 'src/trip-dates/dto/create-trip-date.dto';
import { TripDatesService } from 'src/trip-dates/trip-dates.service';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateTripDto } from './dto/create-trip.dto';
import { CheckInviterDto, SelectTripDto } from './dto/select-trip.dto';
import { InviteTripDto } from './dto/update-trip.dto';
import { Trip } from './trip.entity';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private tripDatesService: TripDatesService,
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

  async findInviters(tripId: string): Promise<User[]> {
    try {
      const trip = await this.tripRepository.findOne({
        relations: ['users'],
        where: { id: tripId },
      });
      return trip.users || [];
    } catch (e) {
      console.error(e);
      throw new NotFoundException();
    }
  }

  async checkInviter(checkInviterDto: CheckInviterDto): Promise<boolean> {
    try {
      const { tripDateId, userId } = checkInviterDto;
      const tripDate = await this.tripDatesService.find({ id: tripDateId });
      if (!tripDate) throw new NotFoundException();
      const tripId = tripDate && tripDate.trip.id;
      if (!tripId) throw new NotFoundException();
      const users = await this.findInviters(tripId);
      if (!users || users.length === 0) throw new NotFoundException(); 
      const matchedUser = users.find(user => user.id === userId);
      return matchedUser ? true : false;
    } catch (e) {
      console.error(e);
      throw new NotFoundException();
    }
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
      trip.users = [user];
      const createdTrip = await this.tripRepository.save(trip);
      const { id: tripId } = createdTrip;
      const createTripDatesDto = new CreateTripDatesDto();
      createTripDatesDto.tripId = tripId;
      createTripDatesDto.beginDate = createTripDto.beginDate;
      createTripDatesDto.endDate = createTripDto.endDate;
      await this.tripDatesService.createTripDates(createTripDatesDto);
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
