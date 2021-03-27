import { ReceiptItem } from "./receiptItems.interface";

export interface Receipt {
  location: Location;
  name: string;
  receiptItems: ReceiptItem[];
  totalPrices: number;
}
export interface Location {
  xPos: number;
  yPos: number;
}
