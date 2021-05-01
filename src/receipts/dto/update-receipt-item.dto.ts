export class UpdateReceiptItemDto {
  name?: string;
  prices?: number;
  receiptItemId: string;
}

export class UpdateUserOfReceiptItemDto {
  action: string;
  userId: string;
  receiptItemId?: string;
}