import { Controller, Get, Param, Query } from '@nestjs/common';
import { SelectTripDateDto } from './dto/select-trip-date.dto';
import { TripDatesService } from './trip-dates.service';

@Controller('trip-dates')
export class TripDatesController {
  constructor(private tripDatesService: TripDatesService) {}

  @Get()
  getDates(@Query('tripId') tripId) {  
    return this.tripDatesService.findAll(tripId);
  }

  @Get(':id')
  getDate(
    @Param('id') id,
  ) {
    const selectTripDateDto = new SelectTripDateDto();
    selectTripDateDto.id = id;
    return this.tripDatesService.find(selectTripDateDto);
  }
}
