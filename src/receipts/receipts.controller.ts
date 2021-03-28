import { Body, Controller, Delete, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { DeleteReceiptDto } from './dto/delete-receipt.dto';
import { Receipt } from './entity/receipt.entity';
import { ReceiptsService } from './receipts.service';

@Controller('receipts')
@UseGuards(JwtAuthGuard)
export class ReceiptsController {
  constructor(
    private receiptsService: ReceiptsService,
  ) {}

  @Post()
  async createReceiptAndReceiptItems(
    @Body() createReceiptDto: CreateReceiptDto,
    @Request() req: any,
  ): Promise<Receipt> {
    createReceiptDto.userId = req.user.userId;
    return await this.receiptsService.createReceipt(createReceiptDto);
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
