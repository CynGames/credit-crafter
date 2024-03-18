import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';
import {
  GenericMessage,
  USER_CREATE_RESPONSE,
  USER_FETCH_RESPONSE,
  UserResponseDTO,
} from '../shared-definitions/types-dto-constants';

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
      // const typedMessage = PayloadTypeExtractor(parsedMessage);

      const { headers, payload } = parsedMessage as GenericMessage<any>;
      const handler = this.responseHandlers.get(headers.correlationId);

      console.log(payload);

      if (handler) {
        console.log('[API GATEWAY] Handler found. Resolving promise...');
        handler(payload);
      }
    } catch (error) {
      console.error('Failed to process message: ', error);
    }
  }

  public async waitForCreateUserResponse(correlationId: string): Promise<any> {
    console.log('[API GATEWAY] Waiting for response...');

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: false });
        this.responseHandlers.delete(correlationId);
        console.log('[API GATEWAY] Promised Resolved!');
      }, 3000);

      this.responseHandlers.set(correlationId, (payload) => {
        console.log('[API GATEWAY] Processing Create User Response...');
        resolve(payload.success);
        this.responseHandlers.delete(correlationId);
        console.log('[API GATEWAY] Promised Resolved!');
      });
    });
  }

  public async waitForFetchUserResponse(
    correlationId: string,
  ): Promise<UserResponseDTO> {
    console.log('[API GATEWAY] Waiting for response...');

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('Error in Promise. Timeout');
        this.responseHandlers.delete(correlationId);
        console.log('[API GATEWAY] Promised Resolved!');
      }, 3000);

      this.responseHandlers.set(correlationId, (payload) => {
        console.log('[API GATEWAY] Processing Fetch User Response...');
        resolve(payload.data);
        this.responseHandlers.delete(correlationId);
        console.log('[API GATEWAY] Promised Resolved!');
      });
    });
  }

  public async waitForCreateUserFinancialDataResponse(
    correlationId: string,
  ): Promise<any> {
    console.log('[API GATEWAY] Waiting for response...');

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject('Error resolving promise. Timeout');
        this.responseHandlers.delete(correlationId);
        console.log('[API GATEWAY] Promised Resolved!');
      }, 3000);

      this.responseHandlers.set(correlationId, (payload) => {
        console.log(
          '[API GATEWAY] Processing Create FINANCIAL DATA Response...',
        );
        console.log(payload);
        clearTimeout(timeoutId);
        resolve(payload);
        this.responseHandlers.delete(correlationId);
      });
    });
  }

  public async waitForFetchUserFinancialDataResponse(
    correlationId: string,
  ): Promise<any> {
    console.log('[API GATEWAY] Waiting for response...');

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('Error resolving promise. Timeout');
        this.responseHandlers.delete(correlationId);
        console.log('[API GATEWAY] Promised Resolved!');
      }, 3000);

      this.responseHandlers.set(correlationId, (payload) => {
        console.log('[API GATEWAY] Processing Fetch User Response...');
        resolve(payload.data);
        this.responseHandlers.delete(correlationId);
        console.log('[API GATEWAY] Promised Resolved!');
      });
    });
  }
}
