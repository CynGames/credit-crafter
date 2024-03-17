import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { LoanConsumer } from './loan/loan.consumer';
import { LoanService } from './loan/loan.service';
import { LoanRepository } from './loan/loan.repository';

@Module({
  imports: [KafkaModule],
  providers: [AppService, LoanConsumer, LoanService, LoanRepository],
})
export class AppModule {}
