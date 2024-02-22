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
  private subscribedTopics: Set<string> = new Set();

  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
    clientId: 'credit-crafter-loan',
  });

  private readonly consumer = this.kafka.consumer({
    groupId: 'loan-service-group',
  });

  async onModuleInit() {
    // const topics = ['loan-message', 'loan-request'];

    await this.consumer.connect();

    await this.consumer.subscribe({
      topics: ['loan-message', 'loan-request'],
    });

    // await this.subscribeToTopics(topics);

    console.log(
      `[LOAN SERVICE CONSUMER] Subscribed to topics: ${this.getSubscribedTopics()}`,
    );

    // await this.consumer.subscribe({
    //   topics: topics,
    //   fromBeginning: true,
    // });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          topic,
          partition,
          offset: message.offset,
          value: message.value.toString(),
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
          default:
            console.warn('Received message from unknown topic: ' + topic);
            break;
        }
      },
    });
  }

  async subscribeToTopics(topics: string[]) {
    for (const topic of topics) {
      await this.consumer.subscribe({ topic });
      this.subscribedTopics.add(topic);
    }
  }

  getSubscribedTopics(): string[] {
    return Array.from(this.subscribedTopics);
  }

  async onApplicationShutdown() {
    await this.consumer.disconnect();
  }
}
