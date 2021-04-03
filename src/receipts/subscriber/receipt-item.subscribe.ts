import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";
import { ReceiptItem } from "../entity/receipt-item.entity";

@EventSubscriber()
export class ReceiptItemSubscriber implements EntitySubscriberInterface<ReceiptItem> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return ReceiptItem;
  }

  beforeInsert(event: InsertEvent<ReceiptItem>) {
    console.log('BEFORE RECEIPT-ITEM INSERTED: ', event.entity);
  }

  afterInsert(event: InsertEvent<ReceiptItem>) {
    console.log('After RECEIPT-ITEM INSERTED: ', event.entity);
  }
}