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
    PAYMENT_CREATE_RESPONSE,
    LOAN_FETCH_REQUEST

  } from '../dto/types-dto-constants';
import { LoanCreatePayload, LoanFetchPayload } from './controller/loan.controller';
import { resolve } from 'path';
import { clearTimeout } from 'timers';
import { response } from 'express';


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
                topics: [LOAN_CREATE_RESPONSE, LOAN_FETCH_RESPONSE,PAYMENT_CREATE_RESPONSE, LOAN_FETCH_REQUEST],
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
    public createLoanHandler(correlationId: string): LoanCreatePayload {
        let output: LoanCreatePayload

        this.responseHandlers.set(correlationId, (response)=>{
            console.log('[API GATEWAY] processing Create Loan Response... ');
            console.log(response);
            
            output = response;
        });
        return output;
    }
    public async waitForCreateResponse(
        correlationId: string,
    ): Promise<LoanCreatePayload> {
        console.log('[API GATEWAY] Waiting for response...');

        return new Promise((resolve)=>{
            const timeoutId = setTimeout(()=>{
                // resolve(response);
                this.responseHandlers.delete(correlationId);
                console.log('[API GATEWAY] Promised Resolved!');
            }, 3000);
            this.responseHandlers.set(correlationId, (response)=>{
                console.log('[API GATEWAY] processing Create Loan Response... ');
                console.log(response);
                
                resolve(response);
            });
        })
    }
    public async waitForFetchResponse(correlationId: string): Promise<LoanFetchPayload>{
            console.log('[API GATEWAY] waiting for response...');

            return new Promise((resolve)=>{
                const timeoutId = setTimeout(()=>{
                    this.responseHandlers.delete(correlationId);
                    console.log('[API-GATEWAY] Resolved');
                
                }, 3000);
                this.responseHandlers.set(correlationId, (response)=>{
                    console.log('[API-GATEWAY] Processing Fetch Loan Response');
                    console.log(response.query.data);
                    resolve(response) 
                })

            })
            
    }
}