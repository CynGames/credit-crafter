import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { ProducerService } from './kafka/producer.service';
import { AppService } from './app.service';
import { HealthService } from './kafka/health.service';
import { PreAuthMiddleware } from './auth/preauth.middleware';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    HealthService,
    AuthService,
    ProducerService,
    HealthService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(PreAuthMiddleware).forRoutes({
    //   path: '*',
    //   method: RequestMethod.ALL,
    // });
  }
}
