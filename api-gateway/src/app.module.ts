import { Module } from '@nestjs/common';

import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';
import { HealthController } from './health/health.controller';
import { HealthConsumer } from './health/health.consumer';

import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { HealthService } from './health/health.service';
import { ProducerService } from './kafka/producer.service';
import { UserConsumer } from './user/user.consumer';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AuthController, UserController, HealthController],
  providers: [
    AuthService,
    UserService,
    UserConsumer,
    HealthService,
    HealthConsumer,
    ProducerService,
  ],
})
export class AppModule {}
