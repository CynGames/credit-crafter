import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProducerService } from './kafka/producer.service';
import { AppService } from './app.service';
import { ConsumerService } from './kafka/consumer.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [ProducerService, AppService, ConsumerService],
})
export class AppModule {}
