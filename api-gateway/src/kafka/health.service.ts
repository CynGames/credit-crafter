import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';
import {
  HEALTH_RESPONSE,
  IsHealthMessageResponse,
  PayloadTypeExtractor,
  ServerStatus,
  ServerStatusPayload,
} from '../dto/types-dto-constants';

@Injectable()
export class HealthService implements OnModuleInit, OnApplicationShutdown {
  private readonly responseHandlers = new Map<
    string,
    (responses: any) => void
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
      topic: HEALTH_RESPONSE,
    });

    await this.initResponseListener();
  }

  async initResponseListener() {
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log('[API GATEWAY] Received Health Response');

        const parsedMessage = JSON.parse(message.value.toString());
        const typedMessage = PayloadTypeExtractor(parsedMessage);

        if (IsHealthMessageResponse(typedMessage)) {
          console.log('Health Response Received');
          const { headers, payload } = typedMessage;
          const handler = this.responseHandlers.get(headers.correlationId);

          if (handler) {
            console.log('[API GATEWAY] Handler found. Resolving promise...');
            handler(payload);
          }
        }
      },
    });
  }

  public async waitForResponse(
    correlationId: string,
  ): Promise<ServerStatusPayload> {
    console.log('[API GATEWAY] Waiting for response...');
    const responses: ServerStatus[] = [];

    const currentServerStatus = this.getCurrentServerStatus();
    responses.push(currentServerStatus);

    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        resolve({ data: responses });
        this.responseHandlers.delete(correlationId);
        console.log('[API GATEWAY] Promised Resolved!');
      }, 3000);

      this.responseHandlers.set(correlationId, (response) => {
        console.log('[API GATEWAY] Processing Health Response...');
        responses.push(response);

        if (responses.length === 3) {
          clearTimeout(timeoutId);
          resolve({ data: responses });
          this.responseHandlers.delete(correlationId);
          console.log('[API GATEWAY] Promised Resolved!');
        }
      });
    });
  }

  private getCurrentServerStatus(): ServerStatus {
    return {
      service: 'API Gateway',
      status: 'OK',
    };
  }
}
