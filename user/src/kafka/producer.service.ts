import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
    clientId: 'credit-crafter-user',
  });

  private readonly producer = this.kafka.producer();

  async onModuleInit() {
    await this.producer.connect();
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }

  async sendMessage(topic: string, messages: any[]) {
    await this.producer.send({
      topic,
      messages: messages.map((message) => ({ value: JSON.stringify(message) })),
    });

    console.log(`[USER SERVICE] Message sent to ${topic}`);
  }
}
