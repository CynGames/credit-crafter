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
    sessionTimeout: 6000,
  });

  async onModuleInit() {
    const topics = ['loan-message', 'loan-request', 'health-check'];

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
          case 'loan-message':
            console.log(
              'Received message from loan-message:' + message.value.toString(),
            );

            await this.appService.handleLoanMessage(message.value.toString());
            break;
          case 'loan-request':
            console.log(
              'Received message from loan-request:' + message.value.toString(),
            );
            await this.appService.handleLoanResponse(message.value.toString());
            break;
          case 'health-check':
            console.log(
              '[LOAN SERVICE] Received message from health-check:' +
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
      },
    });
  }

  async onApplicationShutdown() {
    await this.consumer.disconnect();
  }
}
