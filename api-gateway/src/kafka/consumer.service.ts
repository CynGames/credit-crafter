import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';
import { RESPONSE_TO_API_GATEWAY } from '../dto/types-dto-constants';

@Injectable()
export class ConsumerService implements OnModuleInit, OnApplicationShutdown {
  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
    clientId: 'credit-crafter-api-gateway',
  });

  consumer: Consumer;
  responseHandlers = new Map<string, (value: string) => void>();
  private subscribedTopics = new Set<string>();

  async onModuleInit() {
    this.consumer = this.loadConsumer();
    await this.consumer.connect();
    await this.subscribeToTopic(RESPONSE_TO_API_GATEWAY);
    await this.startListening();
  }

  private loadConsumer() {
    return this.kafka.consumer({
      groupId: 'credit-crafter-api-gateway',
      sessionTimeout: 6000,
    });
  }

  async subscribeToTopic(topic: string) {
    if (this.subscribedTopics.has(topic)) {
      console.log(`[API GATEWAY] Already subscribed to ${topic}`);
      return;
    }

    await this.consumer.subscribe({ topic, fromBeginning: true });
    this.subscribedTopics.add(topic);

    console.log(`[API GATEWAY] Subscribed to ${topic}`);
  }

  // Esto habria que quitarlo o darle un proposito especifico (como en healthService)
  private async startListening() {
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log('[API GATEWAY] Received response');
        console.log({
          topic: topic,
          partition: partition,
        });

        console.log('[API GATEWAY] Handling message...');
        const payload = JSON.parse(message.value.toString());

        const data = payload.value;
        const correlationId = data.correlationId;
        const handler = this.responseHandlers.get(correlationId);

        console.log({
          payload,
        });

        if (handler) {
          console.log('[API GATEWAY] Handler found. Resolving promise...');
          handler(data.value);

          console.log('[API GATEWAY] Promised Resolved!');
          this.responseHandlers.delete(correlationId);
        }
      },
    });
  }

  async onApplicationShutdown() {
    await this.consumer.disconnect();
  }
}