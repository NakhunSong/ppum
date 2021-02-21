import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Trip } from './interfaces/trips.interface';
import { TripsService } from './trips.service';

@Controller('trips')
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Get()
  getTrips(): Trip[] {
    return this.tripsService.findAll();
  }

  @Get(':id')
  getTrip(@Param('id') id: number): Trip {
    return this.tripsService.find(Number(id));
  }
}
