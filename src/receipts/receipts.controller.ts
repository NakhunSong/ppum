import { Body, Controller, Delete, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { CreateReceiptItemDto } from './dto/create-receipt-item.dto';
import { DeleteReceiptDto } from './dto/delete-receipt.dto';
import { Receipt } from './entity/receipt.entity';
import { ReceiptItem } from './entity/receipt-item.entity';
import { ReceiptsService } from './receipts.service';

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
