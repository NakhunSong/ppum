import { Body, Controller, Delete, Param, Patch, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { CreateReceiptItemDto } from './dto/create-receipt-item.dto';
import { DeleteReceiptDto } from './dto/delete-receipt.dto';
import { Receipt } from './entity/receipt.entity';
import { ReceiptItem } from './entity/receipt-item.entity';
import { ReceiptsService } from './receipts.service';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { UpdateReceiptItemDto, UpdateUserOfReceiptItemDto } from './dto/update-receipt-item.dto';

@Controller('receipts')
@UseGuards(JwtAuthGuard)
export class ReceiptsController {
  constructor(
    private receiptsService: ReceiptsService,
  ) {}

  @Post()
  async createReceipt(
    @Body() createReceiptDto: CreateReceiptDto,
    @Request() req: any,
  ): Promise<Receipt> {
    createReceiptDto.userId = req.user.userId;
    return await this.receiptsService.createReceipt(createReceiptDto);
  }

  @Post(':receiptId/item')
  async createReceiptItem(
    @Body() createReceiptItemDto: CreateReceiptItemDto,
    @Param('receiptId') receiptId,
  ): Promise<ReceiptItem> {
    createReceiptItemDto.receiptId = receiptId;
    return await this.receiptsService.createReceiptItem(createReceiptItemDto);
  }

  @Patch(':receiptId')
  async updateReceipt(
    @Body() body,
    @Param('receiptId') receiptId,
  ): Promise<Receipt> {
    const { location, name } = body;
    const updateReceiptDto = new UpdateReceiptDto();
    if (location) updateReceiptDto.location = location;
    if (name) updateReceiptDto.name = name;
    updateReceiptDto.receiptId = receiptId;
    return await this.receiptsService.updateReceipt(updateReceiptDto);
  }

  @Put(':receiptId/item/:receiptItemId')
  async updateReceiptItem(
    @Body() body,
    @Param('receiptItemId') receiptItemId, 
  ): Promise<ReceiptItem> {
    const { name, prices } = body;
    const updateReceiptItemDto = new UpdateReceiptItemDto();
    updateReceiptItemDto.name = name;
    updateReceiptItemDto.prices = prices;
    updateReceiptItemDto.receiptItemId = receiptItemId;
    return this.receiptsService.updateReceiptItem(updateReceiptItemDto);
  }

  @Patch(':receiptId/item/:receiptItemId/user')
  async updateUserOfReceiptItem(
    @Body() updateUserOfReceiptItemDto: UpdateUserOfReceiptItemDto,
    @Param('receiptItemId') receiptItemId,
  ): Promise<ReceiptItem> {
    updateUserOfReceiptItemDto.receiptItemId = receiptItemId;
    return this.receiptsService.updateUserOfReceiptItem(updateUserOfReceiptItemDto);
  }

  @Delete(':receiptId')
  async deleteReceipt(
    @Param('receiptId') receiptId,
    @Request() req: any,
  ): Promise<Receipt> {
    const deleteReceiptDto = new DeleteReceiptDto()
    deleteReceiptDto.receiptId = receiptId;
    deleteReceiptDto.userId = req.user.userId;
    return await this.receiptsService.deleteReceipt(deleteReceiptDto);
  }
}
