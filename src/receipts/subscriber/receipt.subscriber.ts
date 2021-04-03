import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";
import { Receipt } from "../entity/receipt.entity";

@EventSubscriber()
export class ReceiptSubscriber implements EntitySubscriberInterface<Receipt> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Receipt;
  }

  beforeInsert(event: InsertEvent<Receipt>) {
    console.log('BEFORE RECEIPT INSERTED: ', event.entity);
  }

  afterInsert(event: InsertEvent<Receipt>) {
    console.log('After RECEIPT INSERTED: ', event.entity);
  }
}