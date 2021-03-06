import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsersModule } from 'src/users/users.module';
import { TripSubscriber } from './trip.subscriber';
import { Trip } from './trip.entity';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { TripDatesModule } from 'src/trip-dates/trip-dates.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trip, User]),
    UsersModule,
    TripDatesModule,
  ],
  controllers: [TripsController],
  providers: [TripsService, TripSubscriber],
  exports: [TripsService],
})
export class TripsModule {}
