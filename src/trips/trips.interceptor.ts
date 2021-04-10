import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { CheckInviterDto } from "./dto/select-trip.dto";
import { TripsService } from "./trips.service";

@Injectable()
export class TripsInterceptor implements NestInterceptor {
  constructor(
    private tripsService: TripsService,
  ) {}
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    console.log('Trip intercept...');

    try {
      const request = context.switchToHttp().getRequest();
      const {
        body,
        params,
        query,
      } = request;
      const user = request.user;
      const userId = user && user.userId;
      const tripId = query.tripId || body.tripId || params.tripId;
      const checkInviterDto = new CheckInviterDto();
      checkInviterDto.tripId = tripId;
      checkInviterDto.userId = userId;
      const isInviter = await this.tripsService.checkInviter(checkInviterDto);
      console.log('isInviter: ', isInviter);
      if (!isInviter) throw new BadRequestException();
      return next
        .handle();
    } catch (e) {
      console.error(e);
    }
  }
}