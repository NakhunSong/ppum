import { User } from "src/users/user.entity";

export class CreateReceiptItemDto {
  name: string;
  prices: number;
  receiptId: string;
  // userIds: User[];
}