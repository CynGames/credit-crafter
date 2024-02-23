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
    clientId: 'credit-crafter-user',
  });

  private readonly consumer = this.kafka.consumer({
    groupId: 'user-service-group',
    sessionTimeout: 6000,
  });

  async onModuleInit() {
    const topics = ['user-message', 'health-check'];

    await this.consumer.connect();
    await this.consumer.subscribe({ topics });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          topic,
          partition,
          offset: message.offset,
          value: JSON.parse(message.value.toString()),
        });

        switch (topic) {
          case 'health-check':
            console.log(
              '[USER SERVICE] Received message from health-check:' +
                message.value.toString(),
            );

            await this.appService.handleHealthCheckResponse(
              message.value.toString(),
            );
            break;

          default:
            console.warn('Received message from unknown topic: ' + topic);
            break;
        }

        // await this.appService.handleMessage(message.value.toString());
      },
    });
  }

  async onApplicationShutdown() {
    await this.consumer.disconnect();
  }
}
