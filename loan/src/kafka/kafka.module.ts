import { Module } from '@nestjs/common';
import { AppService } from '../app.service';
import { ProducerService } from './producer.service';

@Module({
  providers: [AppService, ProducerService],
  exports: [ProducerService],
})
export class KafkaModule {}
