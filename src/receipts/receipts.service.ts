import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { UpdateReceiptItemDto, UpdateUserOfReceiptItemDto } from './dto/update-receipt-item.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class ReceiptsService {
  constructor(
    @InjectRepository(Receipt)
    private receiptRepository: Repository<Receipt>,
    @InjectRepository(ReceiptItem)
    private receiptItemRepository: Repository<ReceiptItem>,
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private tripsService: TripsService,
    private tripDatesService: TripDatesService,
  ) {}

  async findReceipt(receiptId: string) {
    try {
      const receipt = await this.receiptRepository.findOne({
        where: { id: receiptId },
        relations: ['receiptItems'],
      });
      if (!receipt) throw new NotFoundException();
      return receipt;
    } catch (e) {
      console.error(e);
    }
  }

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

  async updateReceipt(updateReceiptDto: UpdateReceiptDto) {
    try {
      const { location, name, receiptId } = updateReceiptDto;
      const receipt = await this.receiptRepository.findOne({
        where: { id: receiptId },
      });
      if (!receipt) throw new NotFoundException();
      if (!location && !name) throw new BadRequestException();
      if (location) receipt.location = location;
      if (name) receipt.name = name;
      await this.receiptRepository.save(receipt);
      return receipt;
    } catch (e) {
      console.error(e);
      throw new NotFoundException();
    }
  }

  async updateReceiptItem(
    updateReceiptDto: UpdateReceiptItemDto,
  ): Promise<ReceiptItem> {
    try {
      const { name, prices, receiptItemId } = updateReceiptDto;
      const receiptItem = await this.receiptItemRepository.findOne({
        relations: ['users'],
        where: { id: receiptItemId },
      });
      if (!receiptItem) throw new NotFoundException();
      if (name) receiptItem.name = name;
      if (prices) {
        receiptItem.prices = prices;
        receiptItem.price = Math.floor(prices / receiptItem.users.length);
      }
      await this.receiptItemRepository.save(receiptItem);
      return receiptItem;
    } catch (e) {
      console.error(e);
      throw new NotFoundException();
    }
  }

  async updateUserOfReceiptItem(
    updateUserOfReceiptItemDto: UpdateUserOfReceiptItemDto,
  ): Promise<ReceiptItem> {
    try {
      const {
        action,
        userId,
        receiptItemId,
      } = updateUserOfReceiptItemDto;
      const receiptItem = await this.receiptItemRepository.findOne({
        relations: ['users'],
        where: { id: receiptItemId },
      });
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      let users = receiptItem.users;
      switch (action) {
        case 'add': {
          const set = new Set(users.map(u => u.id));
          if (!set.has(userId)) {
            users = [...receiptItem.users, user];
          }
          break;
        }
        case 'remove': {
          users = receiptItem.users.filter(u => u.id !== userId)
          break;
        }
        default: {
          throw new BadRequestException();
        }
      }
      receiptItem.users = users;
      receiptItem.price = Math.floor(receiptItem.prices / users.length);
      await this.receiptItemRepository.save(receiptItem); 
      return receiptItem;
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
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

  async deleteReceiptItem(receiptItemId: string) {
    try {
      const receiptItem = await this.receiptItemRepository.findOne({
        where: { id: receiptItemId },
      });
      if (!receiptItem) throw new NotFoundException();
      await this.receiptItemRepository.remove(receiptItem);
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }
}
