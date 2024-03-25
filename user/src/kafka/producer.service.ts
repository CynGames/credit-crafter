import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka } from 'kafkajs';
import {
  GenericMessage,
  USER_CREATE_RESPONSE,
  UserDTO,
} from '../shared-definitions/types-dto-constants';

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
    clientId: 'credit-crafter-user',
  });

  private readonly producer = this.kafka.producer();

  async sendMessage<T = any>(genericMessage: GenericMessage<T>) {
    const topic = genericMessage.headers.topic;
    const messages: { value: string }[] = [
      { value: JSON.stringify(genericMessage) },
    ];

    console.log('GenericMessage...');
    console.log(genericMessage);

    console.log('Message being sent...');
    console.log(messages);

    await this.producer.send({
      topic,
      messages,
    });

    console.log(`[USER SERVICE] Message sent to ${topic}`);
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }
}
