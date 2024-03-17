import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';
import {
  PayloadTypeExtractor,
  USER_CREATE_RESPONSE,
  USER_FETCH_RESPONSE,
} from '../shared-definitions/types-dto-constants';
import {
  UserCreatePayload,
  UserFetchPayload,
  UserFetchResponseDto,
} from './user.controller';

@Injectable()
export class UserConsumer implements OnModuleInit, OnApplicationShutdown {
  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
    clientId: 'user-api',
  });

  private consumer: Consumer;
  private readonly responseHandlers = new Map<
    string,
    (responses: any) => void
  >();

  constructor() {
    this.consumer = this.kafka.consumer({
      groupId: 'user-api-group',
      sessionTimeout: 6000,
    });
  }

  async onModuleInit() {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({
        topics: [USER_CREATE_RESPONSE, USER_FETCH_RESPONSE],
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
      console.log('[API GATEWAY] Received User Response');
      const parsedMessage = JSON.parse(message.value.toString());
      const typedMessage = PayloadTypeExtractor(parsedMessage);

      const { headers, payload } = typedMessage;
      const handler = this.responseHandlers.get(headers.correlationId);

      if (handler) {
        console.log('[API GATEWAY] Handler found. Resolving promise...');
        handler(payload);
      }
    } catch (error) {
      console.error('Failed to process message: ', error);
    }
  }

  public createUserHandler(correlationId: string): string {
    let output = '';

    this.responseHandlers.set(correlationId, (payload) => {
      console.log('[API GATEWAY] Processing Create User Response...');
      output = payload;
    });

    return output;
  }

  public fetchUserHandler(correlationId: string): any[] {
    const output = [];

    this.responseHandlers.set(correlationId, (payload) => {
      console.log('[API GATEWAY] Processing Fetch User Response...');
      output.push(payload);
    });

    return output;
  }

  public async waitForCreateResponse(
    correlationId: string,
    response: string,
  ): Promise<UserCreatePayload> {
    console.log('[API GATEWAY] Waiting for response...');
    console.log(response);

    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        resolve({ data: { status: 'Unable to Create' } });
        this.responseHandlers.delete(correlationId);
        console.log('[API GATEWAY] Promised Resolved!');
      }, 3000);

      if (response) {
        clearTimeout(timeoutId);
        resolve({ data: { status: 'User Created' } });
        this.responseHandlers.delete(correlationId);
        console.log('[API GATEWAY] Promised Resolved!');
      }
    });
  }

  public async waitForFetchResponse(
    correlationId: string,
    responses: UserFetchResponseDto[],
  ): Promise<UserFetchPayload> {
    console.log('[API GATEWAY] Waiting for response...');
    console.log(responses);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: responses });
        this.responseHandlers.delete(correlationId);
        console.log('[API GATEWAY] Promised Resolved!');
      }, 3000);
    });
  }
}
