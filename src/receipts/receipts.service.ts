import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TripDatesService } from 'src/trip-dates/trip-dates.service';
import { CheckInviterDto } from 'src/trips/dto/select-trip.dto';
import { TripsService } from 'src/trips/trips.service';
import { Repository } from 'typeorm';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { CreateReceiptItemDto } from './dto/create-receiptItem.dto';
import { DeleteReceiptDto } from './dto/delete-receipt.dto';
import { Receipt } from './entity/receipt.entity';
import { ReceiptItem } from './entity/receiptItem.entity';

@Injectable()
export class ReceiptsService {
  constructor(
    @InjectRepository(Receipt)
    private receiptRepository: Repository<Receipt>,
    @InjectRepository(ReceiptItem)
    private receiptItemRepository: Repository<ReceiptItem>,
    private tripsService: TripsService,
    private tripDatesService: TripDatesService,
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
        tripDateId,
        userId,
      } = createReceiptDto;
      const tripDate = await this.tripDatesService.find({ id: tripDateId });
      const checkInviterDto = new CheckInviterDto();
      checkInviterDto.userId = userId;
      checkInviterDto.tripDateId = tripDateId;
      const isMatchedUser = await this.tripsService.checkInviter(checkInviterDto);
      if (!isMatchedUser) throw new NotFoundException();
      const receipt = new Receipt();
      let totalPrices = 0;
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
            totalPrices += receiptItem.price;
          })
        );
      }
      createdReceipt.totalPrices = totalPrices;
      await this.receiptRepository.save(createdReceipt);
      return await this.receiptRepository.findOne({
        relations: ['receiptItems'],
        where: { id: createdReceipt.id },
      });
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
      const checkInviterDto = new CheckInviterDto();
      checkInviterDto.userId = userId;
      checkInviterDto.tripDateId = receipt.tripDate.id;
      const isMatchedUser = await this.tripsService.checkInviter(checkInviterDto);
      if (!isMatchedUser) throw new NotFoundException();
      return await this.receiptRepository.remove(receipt);
    } catch (e) {
      throw new NotFoundException();
    }
  }
}
