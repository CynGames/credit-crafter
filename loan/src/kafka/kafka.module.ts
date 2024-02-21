import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { AppService } from '../app.service';

@Module({
  providers: [ConsumerService, AppService],
  exports: [ConsumerService],
})
export class KafkaModule {}
