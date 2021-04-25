import { Location } from "../interface/receipts.interface";

export class UpdateReceiptDto {
  location?: Location;
  name?: string;
  receiptId: string;
}