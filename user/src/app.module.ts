import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { UsersService } from './services/users.service';

@Module({
  imports: [KafkaModule],
  controllers: [],
  providers: [AppService, UsersService],
})
export class AppModule {}
