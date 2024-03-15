import { Module } from '@nestjs/common';
import { HealthService } from './health/health.service';
import { KafkaModule } from './kafka/kafka.module';
import { UserService } from './user/user.service';
import { UserRepository } from './user/user.repository';
import { UserConsumer } from './user/user.consumer';

@Module({
  imports: [KafkaModule],
  controllers: [],
  providers: [HealthService, UserService, UserRepository, UserConsumer],
})
export class AppModule {}
