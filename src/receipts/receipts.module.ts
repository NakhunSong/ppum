import { Module } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { ReceiptsController } from './receipts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receipt } from './entity/receipt.entity';
import { ReceiptItem } from './entity/receiptItem.entity';
import { TripDatesModule } from 'src/trip-dates/trip-dates.module';
import { TripsModule } from 'src/trips/trips.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Receipt, ReceiptItem]),
    TripsModule,
    TripDatesModule,
  ],
  providers: [ReceiptsService],
  controllers: [ReceiptsController],
  exports: [ReceiptsService],
})
export class ReceiptsModule {}
