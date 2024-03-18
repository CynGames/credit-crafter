import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';
import { LoanController } from './loan/loan.controller';
import { HealthController } from './health/health.controller';

import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { LoanService } from './loan/loan.service';
import { HealthService } from './health/health.service';
import { ProducerService } from './kafka/producer.service';

import { LoanConsumer } from './loan/loan.consumer';
import { HealthConsumer } from './health/health.consumer';
import { UserConsumer } from './user/user.consumer';

@Module({
  imports: [HttpModule],
  controllers: [
    AuthController,
    UserController,
    HealthController,
    LoanController,
  ],
  providers: [
    AuthService,
    UserService,
    UserConsumer,
    HealthService,
    HealthConsumer,
    ProducerService,
    LoanConsumer,
    LoanService,
  ],
})
export class AppModule {}
