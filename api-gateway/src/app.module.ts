import { Module } from '@nestjs/common';

import { HealthService } from './kafka/health.service';
import { ProducerService } from './kafka/producer.service';
import { AuthService } from './auth/auth.service';
import { AppService } from './app.service';

import { AuthController } from './controllers/auth.controller';
import { AppController } from './controllers/app.controller';
import { LoanController } from './controllers/loan.controller';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [],
  controllers: [AuthController, AppController, LoanController, UserController],
  providers: [AppService, AuthService, ProducerService, HealthService],
})
export class AppModule {}
