import { Location } from "../interface/receipts.interface";

export class CreateReceiptDto {
  location: Location;
  name: string;
  tripDateId: string;
  userId: string;
}