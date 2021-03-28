import { Location } from "../interface/receipts.interface";
import { ReceiptItem } from "../interface/receiptItems.interface";

export class CreateReceiptDto {
  location: Location;
  name: string;
  receiptItems?: ReceiptItem[];
  // totalPrices: number;
  tripDateId: string;
  userId?: string;
}