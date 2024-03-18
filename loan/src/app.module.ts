import { Module } from '@nestjs/common';
import { HealthService } from './health/health.service';
import { KafkaModule } from './kafka/kafka.module';
import { LoanConsumer } from './loan/loan.consumer';
import { LoanService } from './loan/loan.service';
import { LoanRepository } from './loan/loan.repository';

@Module({
  imports: [KafkaModule],
  providers: [HealthService, LoanConsumer, LoanService, LoanRepository],
})
export class AppModule {}
