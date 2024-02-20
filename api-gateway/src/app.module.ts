import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaService } from './services/kafka/kafka.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, KafkaService],
})
export class AppModule {}
