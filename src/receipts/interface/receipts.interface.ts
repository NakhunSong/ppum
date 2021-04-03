import { ReceiptItem } from "./receipt-items.interface";

export interface Receipt {
  location: Location;
  name: string;
  receiptItems: ReceiptItem[];
  prices: number;
}
export interface Location {
  xPos: number;
  yPos: number;
}
