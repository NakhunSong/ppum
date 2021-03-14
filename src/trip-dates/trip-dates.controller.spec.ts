import { Test, TestingModule } from '@nestjs/testing';
import { TripDatesController } from './trip-dates.controller';

describe('TripDatesController', () => {
  let controller: TripDatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TripDatesController],
    }).compile();

    controller = module.get<TripDatesController>(TripDatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
