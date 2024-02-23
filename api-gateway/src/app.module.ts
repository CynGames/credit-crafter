import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProducerService } from './kafka/producer.service';
import { AppService } from './app.service';
import { ConsumerService } from './kafka/consumer.service';
import { HealthService } from './kafka/health.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ProducerService, ConsumerService, HealthService],
})
export class AppModule {}
