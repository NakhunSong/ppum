import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { TripsModule } from './trips/trips.module';
import { TripsController } from './trips/trips.controller';
import { logger } from './common/middleware/logger.middleware';

@Module({
  imports: [UsersModule, TripsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(logger)
      .forRoutes(UsersController, TripsController)
  }
}
