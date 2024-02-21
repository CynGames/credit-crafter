import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
