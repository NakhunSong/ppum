import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trip } from 'src/trips/trip.entity';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { CreateTripDatesDto } from './dto/create-trip-date.dto';
import { TripDate } from './trip-date.entity';
import { SelectTripDateDto } from './dto/select-trip-date.dto';

@Injectable()
export class TripDatesService {
  constructor(
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    @InjectRepository(TripDate)
    private tripDateRepository: Repository<TripDate>,
  ) {}

  async createTripDates(createTripDatesDto: CreateTripDatesDto) {
    try {
      const {
        beginDate,
        endDate,
        tripId,
      } = createTripDatesDto;
      const trip = await this.tripRepository.findOne({
        where: { id: tripId },
      });
      const end = DateTime.fromISO(endDate);
      const start = DateTime.fromISO(beginDate);
      const { days } = end.diff(start, 'days');
      Promise.all(
        Array.from({ length: days + 1 }).map(async (e, i) => {
          const tripDate = new TripDate();
          const date = DateTime.fromISO(beginDate);
          tripDate.date = date.plus({ days: i }).toISODate();
          tripDate.trip = trip;
          await this.tripDateRepository.save(tripDate);
        })
      );
    } catch (e) {
      console.error(e);
    }
  }

  async findAll(tripId: string) {
    try {
      const tripDates = await this.tripDateRepository.find({ 
        relations: ['receipts'],
        where: { trip: { id: tripId } },
      });
      return tripDates;
    } catch (e) {
      console.error(e);
    }
  }

  async find(selectTripDateDto: SelectTripDateDto) {
    const { id } = selectTripDateDto;
    try {
      const tripDate = await this.tripDateRepository.findOne({
        relations: ['trip', 'receipts'],
        where: { id },
      });
      return tripDate;
    } catch (e) {
      console.error(e);
    }
  }
}
