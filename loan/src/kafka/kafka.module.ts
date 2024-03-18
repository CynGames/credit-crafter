import { Module } from '@nestjs/common';
import { HealthService } from '../health/health.service';
import { ProducerService } from './producer.service';

@Module({
  providers: [HealthService, ProducerService],
  exports: [ProducerService],
})
export class KafkaModule {}
