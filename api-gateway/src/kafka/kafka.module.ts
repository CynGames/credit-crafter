import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ConsumerService } from './consumer.service';
import { HealthService } from './health.service';

@Module({
  providers: [ProducerService, ConsumerService],
  exports: [ProducerService, ConsumerService],
})
export class KafkaModule {}
