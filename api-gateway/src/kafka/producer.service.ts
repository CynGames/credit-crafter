import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { GenericMessage } from '../dto/generic.dto';

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
    clientId: 'credit-crafter-api-gateway',
  });

  private readonly producer = this.kafka.producer();

  async onModuleInit() {
    await this.producer.connect();
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }

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

    console.log(`[API-GATEWAY] Message sent to ${topic}`);
  }
}
