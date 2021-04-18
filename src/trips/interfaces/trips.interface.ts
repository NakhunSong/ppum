import { TripDate } from "src/trip-dates/trip-date.entity";

export interface Trip {
  id: number;
  name: string;
  beginDate: string;
  endDate: string;
  tripDates: TripDate;
  prices: number;
}