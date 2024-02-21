import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { AppService } from '../app.service';

@Injectable()
export class ConsumerService implements OnModuleInit, OnApplicationShutdown {
  constructor(private readonly appService: AppService) {}

  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
    clientId: 'credit-crafter-loan',
  });

  private readonly consumer = this.kafka.consumer({
    groupId: 'loan-service-group',
  });

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: 'loan-message',
      fromBeginning: true,
    });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          partition,
          offset: message.offset,
          value: message.value.toString(),
        });

        await this.appService.handleMessage(message.value.toString());
      },
    });
  }

  async onApplicationShutdown() {
    await this.consumer.disconnect();
  }
}
