import { Module } from '@nestjs/common';

import { HealthService } from './kafka/health.service';
import { ProducerService } from './kafka/producer.service';
import { AuthService } from './auth/auth.service';
import { AppService } from './app.service';

import { AuthController } from './controllers/auth.controller';
import { AppController } from './controllers/app.controller';
import { LoanController } from './loan/controller/loan.controller';
import { LoanService } from './loan/loan.service';
import { LoanConsumer } from './loan/loan.consumer';


@Module({
  imports: [],
  controllers: [AuthController, AppController, LoanController],
  providers: [AppService, AuthService, ProducerService, HealthService, LoanConsumer, LoanService],
})
export class AppModule {}
