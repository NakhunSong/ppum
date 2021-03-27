import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { ReceiptsService } from './receipts.service';

@Controller('receipts')
@UseGuards(JwtAuthGuard)
export class ReceiptsController {
  constructor(
    private receiptsService: ReceiptsService,
  ) {}

  @Post()
  async create(
    @Body() createReceiptDto: CreateReceiptDto,
    @Request() req: any,
  ) {
    createReceiptDto.userId = req.user.userId;
    await this.receiptsService.createReceipt(createReceiptDto);
  }
}
