import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { Trip } from './trip.entity';

@EventSubscriber()
export class TripSubscriber implements EntitySubscriberInterface<Trip> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Trip;
  }

  beforeInsert(event: InsertEvent<Trip>) {
    console.log('BEFORE TRIP INSERTED: ', event.entity);
  }

  afterInsert(event: InsertEvent<Trip>) {
    console.log('AFTER TRIP INSERTED: ', event.entity);
  }

  beforeUpdate(event: UpdateEvent<Trip>) {
    console.log('BEFORE TRIP UPDATED: ', event.entity);
  }

  afterUpdate(event: UpdateEvent<Trip>) {
    console.log('AFTER TRIP UPDATED: ', event.entity);
  }
}