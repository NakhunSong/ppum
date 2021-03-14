import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trip } from 'src/trips/trip.entity';
import { Repository } from 'typeorm';
import { CreateTripDatesDto } from './dto/create-trip-date.dto';
import { TripDate } from './trip-date.entity';

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
      Promise.all(
        Array.from({ length: 3 }).map(async (e, i) => {
          const tripDate = new TripDate();
          tripDate.date = beginDate + i; // meaning: beginDate + index
          tripDate.trip = trip;
          await this.tripDateRepository.save(tripDate);
        })
      );
    } catch (e) {
      console.error(e);
    }
  }
}
