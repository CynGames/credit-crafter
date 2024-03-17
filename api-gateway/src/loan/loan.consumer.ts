import {
    Injectable,
    OnApplicationShutdown,
    OnModuleInit,
} from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';
import {
    PayloadTypeExtractor,
    ServerStatusPayload,
    LOAN_CREATE_RESPONSE,
    LOAN_FETCH_RESPONSE,
    PAYMENT_CREATE_RESPONSE

  } from '../dto/types-dto-constants';
import { LoanCreatePayload } from './controller/loan.controller';
import { resolve } from 'path';
import { clearTimeout } from 'timers';


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
                topics: [LOAN_CREATE_RESPONSE, LOAN_FETCH_RESPONSE, PAYMENT_CREATE_RESPONSE],
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
    public createLoanHandler(correlationId: string): string {
        let output = '';

        this.responseHandlers.set(correlationId, (response)=>{
            console.log('[API GATEWAY] processing Create Loan Response... ');
            output = response;
        });
        return output;
    }
    public async waitForCreateResponse(
        correlationId: string,
        response: string,
    ): Promise<LoanCreatePayload> {
        console.log('[API GATEWAY] Waiting for response...');
        console.log(response);

        return new Promise((resolve)=>{
            const timeoutId = setTimeout(()=>{
                resolve({ data: {status: 'Unable to Create' } });
                this.responseHandlers.delete(correlationId);
                console.log('[API GATEWAY] Promised Resolved!');
            }, 3000);
            if (response){
                clearTimeout(timeoutId);
                resolve({ data: { status: 'User Created'} });
                this.responseHandlers.delete(correlationId);
                console.log('[API GATEWAY] Promised Resolved!');
            }
        })
        
        
    }
}