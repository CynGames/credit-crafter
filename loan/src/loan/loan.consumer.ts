import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka } from 'kafkajs';
import {
  LOAN_CREATE_RESPONSE,
  LOAN_CREATE_REQUEST,
  LOAN_FETCH_REQUEST,
  LOAN_FETCH_RESPONSE,
  PAYMENT_CREATE_RESPONSE,
  GenericMessage,
} from '../shared-definitions/types-dto-constants';
import { LoanService } from './loan.service';
import { ProducerService } from 'src/kafka/producer.service';
import { LoanDTO } from './dtos/loan-dto';

@Injectable()
export class LoanConsumer implements OnModuleInit, OnApplicationShutdown {
  constructor(
    private readonly loanService: LoanService,
    private readonly producerService: ProducerService,
  ) {}

  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
    clientId: 'loan-module',
  });

  private readonly consumer = this.kafka.consumer({
    groupId: 'loan-service-group',
    sessionTimeout: 6000,
  });

  async onModuleInit() {
    const topics = [
      LOAN_CREATE_RESPONSE,
      LOAN_CREATE_REQUEST,
      LOAN_FETCH_RESPONSE,
      PAYMENT_CREATE_RESPONSE,
      LOAN_FETCH_REQUEST,
    ];
    console.log('topics: ' + topics);

    await this.consumer.connect();
    await this.consumer.subscribe({ topics });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log('[LOAN_CONSUMER] ' + topic);
        const parsedMessage = JSON.parse(message.value.toString());
        switch (topic) {
          case LOAN_CREATE_REQUEST:
            const loanId = await this.loanService.create(parsedMessage.payload);

            await this.producerService.constructResponse(
              parsedMessage.headers.correlationId,
              parsedMessage.headers.userRecord,
              'CreateLoanResponse',
              LOAN_CREATE_RESPONSE,
              loanId,
            );
            break;
          case LOAN_FETCH_REQUEST:
            const loans: LoanDTO[] = await this.loanService.getLoansByUser(
              parsedMessage.payload.userId,
            );
            const fetchMessage: GenericMessage<any> = {
              headers: {
                type: 'FetchUserIdLoan',
                topic: LOAN_FETCH_RESPONSE,
                correlationId: parsedMessage.headers.correlationId,
                userRecord: parsedMessage.headers.userRecord,
              },
              payload: {
                query: {
                  status: 'success',
                  data: loans,
                },
              },
            };
            await this.producerService.sendMessage(fetchMessage);
            break;
          default:
            console.warn('Received message from unknown: ' + topic);
        }
      },
    });
  }
  async onApplicationShutdown() {
    await this.consumer.disconnect();
  }
}
