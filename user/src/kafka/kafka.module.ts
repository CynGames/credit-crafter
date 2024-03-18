import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { HealthConsumer } from '../health/health.consumer';
import { HealthService } from '../health/health.service';

@Module({
  providers: [ProducerService, HealthConsumer, HealthService],
  exports: [ProducerService, HealthConsumer],
})
export class KafkaModule {}
