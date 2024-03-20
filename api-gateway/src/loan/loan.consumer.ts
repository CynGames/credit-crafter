import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';
import {
  LOAN_CREATE_RESPONSE,
  LOAN_FETCH_REQUEST,
  LOAN_FETCH_RESPONSE,
  LOAN_UPDATE_RESPONSE,
  PAYMENT_CREATE_RESPONSE,
} from '../shared-definitions/types-dto-constants';
import { LoanCreatePayload, LoanFetchPayload } from './dto/payload-dtos';
import { resolve } from 'path';

@Injectable()
export class LoanConsumer implements OnModuleInit, OnApplicationShutdown {
  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
    clientId: 'loan-api',
  });

  private consumer: Consumer;

  private readonly responseHandlers = new Map<
    string,
    (responses: any) => void
  >();

  constructor() {
    this.consumer = this.kafka.consumer({
      groupId: 'loan-api-group',
      sessionTimeout: 6000,
    });
  }
  async onModuleInit() {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({
        topics: [
          LOAN_CREATE_RESPONSE,
          LOAN_FETCH_RESPONSE,
          PAYMENT_CREATE_RESPONSE,
          LOAN_UPDATE_RESPONSE
        ],
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
      console.log('[API GATEWAY] Received Loan Response');
      const parsedMessage = JSON.parse(message.value.toString());
      // const typedMessage = PayloadTypeExtractor(parsedMessage);

      const { headers, payload } = parsedMessage;
      const handler = this.responseHandlers.get(headers.correlationId);

      if (handler) {
        console.log('[API GATEWAY] Handler found. Resolving promise...');
        handler(payload);
      }
    } catch (error) {
      console.error('Failed to process message: ', error);
    }
  }

  public async genericWaitResponse<t>(correlationId: string): Promise<t>{
    console.log('[API-GATEWAY] Waiting for response...');

    return new Promise((resolve):void =>{
    const id: NodeJS.Timeout = setTimeout((): void=>{
      resolve({status: 'timeout', data: null} as t);
      this.responseHandlers.delete(correlationId);
      console.log('[API GATEWAY] Promised Resolved! (timeout)');
    }, 3000);
      this.responseHandlers.set(correlationId, (payload):void=>{
        console.log('[API GATEWAY] Processing Fetch User Response...');
         console.log(payload);
        
        resolve({ status: 'success', data: payload.data } as t);
        this.responseHandlers.delete(correlationId);
        clearTimeout(id);
        console.log('[API GATEWAY] Promised Resolved!');
      })
    })
  }
}
