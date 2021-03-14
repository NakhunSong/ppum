import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";
import { TripDate } from "./trip-date.entity";

@EventSubscriber()
export class TripDateSubscriber implements EntitySubscriberInterface<TripDate> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return TripDate;
  }

  beforeInsert(event: InsertEvent<TripDate>) {
    console.log('BEFORE TRIP-DATE INSERTED: ', event.entity);
  }

  afterInsert(event: InsertEvent<TripDate>) {
    console.log('After TRIP-DATE INSERTED: ', event.entity);
  }
}