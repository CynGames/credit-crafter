import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';

@Injectable()
export class HealthService implements OnModuleInit, OnApplicationShutdown {
  private readonly responseHandlers = new Map<
    string,
    (responses: any[]) => void
  >();

  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
    clientId: 'health-check-api',
  });

  private consumer: Consumer;

  async onApplicationShutdown() {
    await this.consumer.disconnect();
  }

  async onModuleInit() {
    this.consumer = this.kafka.consumer({
      groupId: 'credit-crafter-health-check',
      sessionTimeout: 6000,
    });

    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: 'health-check-response',
    });

    await this.initResponseListener();
  }

  async initResponseListener() {
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log('[API GATEWAY] Received Health Response');
        const payload = JSON.parse(message.value.toString());

        const data = payload.value;
        const correlationId = data.correlationId;
        const handler = this.responseHandlers.get(correlationId);

        console.log({
          data: data.value,
        });

        if (handler) {
          console.log('[API GATEWAY] Handler found. Resolving promise...');
          handler(data.value);
        }
      },
    });
  }

  public async waitForResponse(correlationId: string): Promise<any> {
    console.log('[API GATEWAY] Waiting for response...');
    const responses: any[] = [];

    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        resolve(responses);
        this.responseHandlers.delete(correlationId);
        console.log('[API GATEWAY] Promised Resolved!');
      }, 3000);

      this.responseHandlers.set(correlationId, (response) => {
        console.log('[API GATEWAY] Processing Health Response...');
        responses.push(response);

        if (responses.length === 2) {
          clearTimeout(timeoutId);
          resolve(responses);
          this.responseHandlers.delete(correlationId);
          console.log('[API GATEWAY] Promised Resolved!');
        }
      });
    });
  }
}
