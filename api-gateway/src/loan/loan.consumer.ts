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

  } from '../shared-definitions/types-dto-constants';


@Injectable()
export class LoanConsumer implements OnModuleInit, OnApplicationShutdown {
    private readonly kafka = new Kafka({
        brokers: ['localhost:9002'],
        clientId: 'user-api',
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
}