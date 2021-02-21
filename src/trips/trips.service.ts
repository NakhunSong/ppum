import { Injectable } from '@nestjs/common';
import { Trip } from './interfaces/trips.interface';

@Injectable()
export class TripsService {
  private readonly trip: Trip = {
    id: 0,
    name: 'First Trip',
    beginDate: '2020-10-15',
    endDate: '2020-10-18',
  }
  private readonly trips: Trip[] = [this.trip];

  findAll(): Trip[] {
    return this.trips;
  }
  find(id: number): Trip {
    return this.trips.find(e => e.id === id);
  }
}
