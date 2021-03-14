import { Module } from '@nestjs/common';
import { TripDatesService } from './trip-dates.service';
import { TripDatesController } from './trip-dates.controller';
import { TripDateSubscriber } from './trip-date.subscriber';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from 'src/trips/trip.entity';
import { TripDate } from './trip-date.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, TripDate])],
  providers: [TripDatesService, TripDateSubscriber],
  controllers: [TripDatesController]
})
export class TripDatesModule {}
