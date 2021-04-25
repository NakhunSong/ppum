import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TripDatesService } from 'src/trip-dates/trip-dates.service';
import { CheckInviterDto } from 'src/trips/dto/select-trip.dto';
import { TripsService } from 'src/trips/trips.service';
import { Repository } from 'typeorm';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { CreateReceiptItemDto } from './dto/create-receipt-item.dto';
import { DeleteReceiptDto } from './dto/delete-receipt.dto';
import { Receipt } from './entity/receipt.entity';
import { ReceiptItem } from './entity/receipt-item.entity';
import { Trip } from 'src/trips/trip.entity';

@Injectable()
export class ReceiptsService {
  constructor(
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    @InjectRepository(Receipt)
    private receiptRepository: Repository<Receipt>,
    @InjectRepository(ReceiptItem)
    private receiptItemRepository: Repository<ReceiptItem>,
    private tripsService: TripsService,
    private tripDatesService: TripDatesService,
  ) {}

  async createReceipt(createReceiptDto: CreateReceiptDto) {
    try {
      const {
        location,
        name,
        tripDateId,
        userId,
      } = createReceiptDto;
      const tripDate = await this.tripDatesService.find({ id: tripDateId });
      const receipt = new Receipt();
      receipt.location = location;
      receipt.name = name;
      receipt.prices = 0;
      receipt.trip = tripDate.trip;
      receipt.tripDate= tripDate;
      const createdReceipt = await this.receiptRepository.save(receipt);
      return createdReceipt;
    } catch (e) {
      console.error(e);
    }
  }

  async createReceiptItem(createReceiptItemDto: CreateReceiptItemDto) {
    try {
      const { name, prices, receiptId } = createReceiptItemDto;
      const receipt = await this.receiptRepository.findOne({
        where: { id: receiptId },
        relations: ['trip'],
      });
      if (!receipt) throw new NotFoundException();
      const { trip } = receipt;
      if (!trip) throw new NotFoundException();
      const users = await this.tripsService.findInviters(trip.id);
      if (!users) throw new NotFoundException();
      const receiptItemPrices = prices;
      const receiptItemPrice = Math.floor(receiptItemPrices / users.length);
      const receiptItem = new ReceiptItem();
      receiptItem.name = name;
      receiptItem.prices = receiptItemPrices;
      receiptItem.price = receiptItemPrice;
      receiptItem.receipt = receipt;
      receiptItem.users = users;
      receipt.prices += receiptItemPrices;
      trip.prices += prices;
      await this.tripRepository.save(trip);
      await this.receiptRepository.save(receipt);
      return await this.receiptItemRepository.save(receiptItem);
    } catch (e) {
      console.error(e);
    }
  }

  async deleteReceipt(deleteReceiptDto: DeleteReceiptDto): Promise<Receipt> {
    try {
      const { receiptId, userId } = deleteReceiptDto;
      const receipt = await this.receiptRepository.findOne({
        relations: ['tripDate'],
        where: { id: receiptId },
      });
      if (!receipt) throw new NotFoundException();
      return await this.receiptRepository.remove(receipt);
    } catch (e) {
      throw new NotFoundException();
    }
  }
}
