import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProducerService } from './kafka/producer.service';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [ProducerService, AppService],
})
export class AppModule {}
