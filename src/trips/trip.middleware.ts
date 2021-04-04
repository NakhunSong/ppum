import { Injectable, NestMiddleware, NotFoundException, UseGuards } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CheckInviterDto } from "./dto/select-trip.dto";
import { TripsService } from "./trips.service";

@Injectable()
export class TripMiddleware implements NestMiddleware {
  constructor(
    private tripsService: TripsService,
  ) {}
  @UseGuards(JwtAuthGuard)
  async use(req: any, res: Response, next: NextFunction) {
    console.log('req.params: ', req.params);
    console.log('req.query: ', req.query);
    console.log('req.body: ', req.body);
    console.log('req.method: ', req.method);
    const user = req.user;
    console.log('user: ', user);
    const userId = user.userId;
    console.log('userId: ', userId);
    const tripId = req.query.tripId || req.body.tripId || req.params[0].split('/')[1];
    console.log('tripId: ', tripId);
    if (!tripId || !userId) throw new NotFoundException();
    const checkInviterDto = new CheckInviterDto();
    checkInviterDto.tripId = tripId;
    checkInviterDto.userId = userId;
    const isInviter = await this.tripsService.checkInviter(checkInviterDto);
    if (!isInviter) throw new NotFoundException();
    next();
  }
}