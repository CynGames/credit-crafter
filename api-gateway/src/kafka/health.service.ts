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
  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
    clientId: 'health-check-api',
  });

  private consumer: Consumer;
  private readonly responseHandlers = new Map<
    string,
    (responses: any) => void
  >();

  constructor() {
    this.consumer = this.kafka.consumer({
      groupId: 'credit-crafter-health-check',
      sessionTimeout: 6000,
    });
  }

  async onModuleInit() {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({
        topic: HEALTH_RESPONSE,
      });

      await this.listenForMessages();
    } catch (error) {
      console.error('Failed to init Kafka Consumer', error);
    }
  }

  async onApplicationShutdown() {
    try {
      await this.consumer.disconnect();
    } catch (error) {
      console.error('Failed to disconnect Kafka Consumer', error);
    }
  }

  async listenForMessages() {
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        await this.processMessage(message);
      },
    });
  }

  public async processMessage(message: any) {
    try {
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
    } catch (error) {
      console.error('Failed to process message: ', error);
    }
  }

  public registerResponseHandler(correlationId: string) {
    const responses: ServerStatus[] = [this.getCurrentServerStatus()];

    this.responseHandlers.set(correlationId, (response) => {
      console.log('[API GATEWAY] Processing Health Response...');
      responses.push(response);
    });

    return responses;
  }

  public async waitForResponse(
    correlationId: string,
    responses: ServerStatus[],
  ): Promise<ServerStatusPayload> {
    console.log('[API GATEWAY] Waiting for response...');
    console.log(responses);

    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        resolve({ data: responses });
        this.responseHandlers.delete(correlationId);
        console.log('[API GATEWAY] Promised Resolved!');
      }, 1000);

      if (responses.length >= 3) {
        clearTimeout(timeoutId);
        resolve({ data: responses });
        this.responseHandlers.delete(correlationId);
        console.log('[API GATEWAY] Promised Resolved!');
      }
    });
  }

  private getCurrentServerStatus(): ServerStatus {
    return {
      service: 'API Gateway',
      status: 'OK',
    };
  }
}
