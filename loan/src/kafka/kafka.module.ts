import { Module } from '@nestjs/common';
import { HealthService } from '../health/health.service';
import { ProducerService } from './producer.service';
import { HealthConsumer } from '../health/health.consumer';

@Module({
  providers: [HealthService, HealthConsumer, ProducerService],
  exports: [ProducerService],
})
export class KafkaModule {}
