import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TripDatesService } from 'src/trip-dates/trip-dates.service';
import { TripsService } from 'src/trips/trips.service';
import { Repository } from 'typeorm';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { CreateReceiptItemDto } from './dto/create-receiptItem.dto';
import { Receipt } from './entity/receipt.entity';
import { ReceiptItem } from './entity/receiptItem.entity';

@Injectable()
export class ReceiptsService {
  constructor(
    @InjectRepository(Receipt)
    private receiptRepository: Repository<Receipt>,
    @InjectRepository(ReceiptItem)
    private receiptItemRepository: Repository<ReceiptItem>,
    private tripsServices: TripsService,
    private tripDatesServices: TripDatesService,
  ) {}

  async createReceiptItem(createReceiptItemDto: CreateReceiptItemDto) {
    try {
      const receipt = await this.receiptRepository.findOne({
        where: { id: createReceiptItemDto.receiptId }
      })
      const receiptItem = new ReceiptItem();
      receiptItem.name = createReceiptItemDto.name;
      receiptItem.price = createReceiptItemDto.price;
      receiptItem.receipt = receipt;
      return await this.receiptItemRepository.save(receiptItem);
    } catch (e) {
      console.error(e);
    }
  }

  async createReceipt(createReceiptDto: CreateReceiptDto) {
    try {
      const {
        location,
        name,
        receiptItems = [],
        totalPrices,
        tripDateId,
        userId,
      } = createReceiptDto;
      const tripDate = await this.tripDatesServices.find({ id: tripDateId });
      if (!tripDate) throw new NotFoundException();
      const tripId = tripDate && tripDate.trip.id;
      if (!tripId) throw new NotFoundException();
      const users = await this.tripsServices.findInviters(tripId);
      if (!users || users.length === 0) throw new NotFoundException(); 
      const matchedUser = users.find(user => user.id === userId);
      if (!matchedUser) throw new NotFoundException();
      const receipt = new Receipt();
      receipt.location = location;
      receipt.name = name;
      receipt.totalPrices = totalPrices;
      receipt.tripDate= tripDate;
      const createdReceipt = await this.receiptRepository.save(receipt);
      if (createdReceipt && receiptItems.length !== 0) {
        await Promise.all(
          receiptItems.map(async receiptItem => {
            const createReceiptItemDto = new CreateReceiptItemDto();
            createReceiptItemDto.name = receiptItem.name;
            createReceiptItemDto.price = receiptItem.price;
            createReceiptItemDto.receiptId = createdReceipt.id
            await this.createReceiptItem(createReceiptItemDto);
          })
        )
      }
    } catch (e) {
      console.error(e);
    }
  }
}
