import { Module } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { ReceiptsController } from './receipts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receipt } from './entity/receipt.entity';
import { ReceiptItem } from './entity/receipt-item.entity';
import { TripDatesModule } from 'src/trip-dates/trip-dates.module';
import { TripsModule } from 'src/trips/trips.module';
import { ReceiptSubscriber } from './subscriber/receipt.subscriber';
import { ReceiptItemSubscriber } from './subscriber/receipt-item.subscribe';
import { Trip } from 'src/trips/trip.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Receipt, ReceiptItem, Trip, User]),
    TripsModule,
    TripDatesModule,
  ],
  providers: [ReceiptsService, ReceiptSubscriber, ReceiptItemSubscriber],
  controllers: [ReceiptsController],
  exports: [ReceiptsService],
})
export class ReceiptsModule {}
