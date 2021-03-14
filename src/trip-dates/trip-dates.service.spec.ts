import { Test, TestingModule } from '@nestjs/testing';
import { TripDatesService } from './trip-dates.service';

describe('TripDatesService', () => {
  let service: TripDatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TripDatesService],
    }).compile();

    service = module.get<TripDatesService>(TripDatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
