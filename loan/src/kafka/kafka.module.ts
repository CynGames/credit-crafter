import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { AppService } from '../app.service';
import { ProducerService } from './producer.service';

@Module({
  providers: [ConsumerService, AppService, ProducerService],
  exports: [ConsumerService, ProducerService],
})
export class KafkaModule {}
