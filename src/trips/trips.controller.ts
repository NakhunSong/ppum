import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTripDatesDto } from 'src/trip-dates/dto/create-trip-date.dto';
import { CreateTripDto } from './dto/create-trip.dto';
import { SelectTripDto } from './dto/select-trip.dto';
import { InviteTripDto } from './dto/update-trip.dto';
import { Trip } from './trip.entity';
import { TripsService } from './trips.service';

@Controller('trips')
export class TripsController {
  constructor(
    private tripsService: TripsService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getTrips(@Request() req) {
    return this.tripsService.findAll(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getTrip(
    @Param('id') tripId: string,
    @Request() req: any,
  ): Promise<Trip> {
    const selectTripDto = new SelectTripDto();
    selectTripDto.userId = req.user.userId;
    selectTripDto.tripId = tripId;
    return this.tripsService.find(selectTripDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createTripDto: CreateTripDto,
    @Request() req: any,
  ) {
    await this.tripsService.create(createTripDto, req.user.userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  invite(
    @Body('username') username: string,
    @Param('id') tripId: string, 
    @Request() req: any,
  ) {
    const inviteTripDto = new InviteTripDto();
    inviteTripDto.tripId = tripId;
    inviteTripDto.userId = req.user.userId;
    inviteTripDto.invitee = username;
    this.tripsService.invite(inviteTripDto);
  }
}
