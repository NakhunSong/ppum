export class SelectTripDto {
  tripId: string;
  userId: string;
}

export class SelectTripByUserDto {
  targetUserId: string;
  tripId: string;
  userId: string;
}

export class CheckInviterDto {
  tripId: string;
  userId: string;
}