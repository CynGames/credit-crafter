import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ConsumerService } from './consumer.service';
import { AppService } from '../app.service';

@Module({
  providers: [ProducerService, ConsumerService, AppService],
  exports: [ProducerService, ConsumerService],
})
export class KafkaModule {}
