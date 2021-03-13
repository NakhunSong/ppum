import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTripDto } from './dto/create-trip.dto';
import { SelectTripDto } from './dto/select-trip.dto';
import { InviteTripDto } from './dto/update-trip.dto';
import { Trip } from './trip.entity';
import { TripsService } from './trips.service';

@Controller('trips')
@UseGuards(JwtAuthGuard)
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Get()
  getTrips(@Request() req) {
    return this.tripsService.findAll(req.user.userId);
  }

  @Get(':id')
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
  create(
    @Body() createTripDto: CreateTripDto,
    @Request() req: any,
  ) {
    this.tripsService.create(createTripDto, req.user.userId);
  }

  @Put(':id')
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
