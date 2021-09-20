import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTripDatesDto } from 'src/trip-dates/dto/create-trip-date.dto';
import { TripDatesService } from 'src/trip-dates/trip-dates.service';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateTripDto } from './dto/create-trip.dto';
import { CheckInviterDto, SelectTripByUserDto, SelectTripDto } from './dto/select-trip.dto';
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
    try {
      const user = await this.userRepository.findOne({
        relations: ['trips'],
        where: { id: userId },
      });
      if (!user) throw new NotFoundException();
      return user.trips;
    } catch (e) {
      console.error(e);
      throw new NotFoundException();
    }
  }

  async find(selectTripDto: SelectTripDto): Promise<Trip> {
    try {
      const trip = await this.tripRepository.findOne({
        relations: ['tripDates', 'tripDates.receipts', 'tripDates.receipts.receiptItems'],
        where: { id: selectTripDto.tripId },
      });
      return trip;
    } catch (e) {
      console.error(e);
      throw new NotFoundException();
    }
  }

  async findByUser(selectTripByUserDto: SelectTripByUserDto): Promise<Trip> {
    try {
      const { targetUserId, tripId } = selectTripByUserDto;
      const trip = await this.tripRepository.findOne({
        relations: [
          'tripDates',
          'tripDates.receipts',
          'tripDates.receipts.receiptItems',
          'tripDates.receipts.receiptItems.users',
        ],
        where: { id: tripId },
      });
      let prices = 0;
      if (trip.tripDates.length === 0) return trip;
      const tripDates = trip.tripDates.map(tripDate => {
        if (tripDate.receipts.length === 0) return tripDate;
        const receipts = tripDate.receipts.filter(receipt => {
          if (receipt.receiptItems.length === 0) return false;
          const receiptItems = receipt.receiptItems.filter(receiptItem => {
            const user = receiptItem.users.find(user => user.id === targetUserId);
            if (user) prices += receiptItem.price;
            return user;
          });
          if (receiptItems.length === 0) return false;
          receipt.receiptItems = receiptItems;
          return receipt;
        });
        tripDate.receipts = receipts;
        return tripDate;
      });
      trip.prices = prices;
      return trip;
    } catch (e) {
      console.error(e);
      throw new NotFoundException();
    }
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
      const { tripId, userId } = checkInviterDto;
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
