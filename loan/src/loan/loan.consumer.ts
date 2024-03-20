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
  LOAN_UPDATE_REQUEST,
  LoanUpdateResponse,
  LOAN_UPDATE_RESPONSE,
  LoanFetchPayload,
  LoanUpdatePayload,
  PAYMENT_CREATE_REQUEST,
  CreatePaymentResponse,
  PaymentCreatePayload,
  PAYMENT_FETCH_REQUEST,
  PaymentFetchPayload,
  PAYMENT_FETCH_RESPONSE,
} from '../shared-definitions/types-dto-constants';
import { LoanService } from './loan.service';
import { ProducerService } from 'src/kafka/producer.service';
import { LoanDTO } from './dtos/loan-dto';
import { CreatePaymentDTO } from './dtos/create-payment-dto';

@Injectable()
export class LoanConsumer implements OnModuleInit, OnApplicationShutdown {
  constructor(
    private readonly loanService: LoanService,
    private readonly producerService: ProducerService,
  ) { }

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
      LOAN_FETCH_REQUEST,
      LOAN_UPDATE_REQUEST,
      PAYMENT_CREATE_REQUEST,
      PAYMENT_FETCH_REQUEST
    ];
    console.log('topics: ' + topics);

    await this.consumer.connect();
    await this.consumer.subscribe({ topics });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log('[LOAN_CONSUMER] ' + topic);
        const parsedMessage = JSON.parse(message.value.toString());
        console.log(parsedMessage);
        
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
            const fetchMessage: GenericMessage<LoanFetchPayload> = {
              headers: {
                type: 'FetchUserIdLoan',
                topic: LOAN_FETCH_RESPONSE,
                correlationId: parsedMessage.headers.correlationId,
                userRecord: parsedMessage.headers.userRecord,
              },
              payload: {
                status: 'success',
                data: {
                  loans
                },
              },
            };
            await this.producerService.sendMessage(fetchMessage);
            break;
          case LOAN_UPDATE_REQUEST:
            try {
              await this.loanService.changLoanState(parsedMessage.payload.loanId, parsedMessage.payload.state);
              const updateMessage: GenericMessage<LoanUpdatePayload> = {
                headers: {
                  type: 'UpdateLoanResponse',
                  topic: LOAN_UPDATE_RESPONSE,
                  correlationId: parsedMessage.headers.correlationId,
                  userRecord: parsedMessage.headers.userRecord
                },
                payload: {
                  status: 'success',
                  data: {
                    loanId: parsedMessage.payload.loanId,
                    state: parsedMessage.payload.state
                  }
                }
              }
              await this.producerService.sendMessage(updateMessage);
            } catch (error) {
              console.log(`ERROR updating loan state: ${error.message}`);

              const errorMessage: GenericMessage<LoanUpdatePayload> = {
                headers: {
                  type: 'UpdateLoanResponse',
                  topic: LOAN_UPDATE_RESPONSE,
                  correlationId: parsedMessage.headers.correlationId,
                  userRecord: parsedMessage.headers.userRecord
                },
                payload: {
                  status: 'Error',
                  data: {
                    error: error.message
                  }
                }
              }
              await this.producerService.sendMessage(errorMessage)
            }
            break;
          case PAYMENT_CREATE_REQUEST:
            try{
            const payment_id = await this.loanService.createPayment(parsedMessage.payload);
            const successMessage: GenericMessage<PaymentCreatePayload> = {
              headers: {
                type: 'CreatePaymentResponse',
                topic: PAYMENT_CREATE_RESPONSE,
                correlationId: parsedMessage.headers.correlationId,
                userRecord: parsedMessage.headers.userRecord
              },
              payload: {
                status: 'success',
                data: {
                  paymentId: payment_id
                }
              }
            }
            await this.producerService.sendMessage(successMessage);
            }catch(error){
              const errorMessage: GenericMessage<PaymentCreatePayload> = {
                headers: {
                  type: 'CreatePaymentResponse',
                  topic: PAYMENT_CREATE_RESPONSE,
                  correlationId: parsedMessage.headers.correlationId,
                  userRecord: parsedMessage.headers.userRecord
                },
                payload: {
                  status: 'Error',
                  data: {
                    error: error.message
                  }
                }
              }
              await this.producerService.sendMessage(errorMessage);
            }

            break;
            case PAYMENT_FETCH_REQUEST:
            try{
              const payments = await this.loanService.getPaymentsByLoan(parsedMessage.payload.loan_id.loan_id);
              const successMessage: GenericMessage<PaymentFetchPayload> = {
              headers: {
                type: 'FetchLoanIdPayments',
                topic: PAYMENT_FETCH_RESPONSE,
                correlationId: parsedMessage.headers.correlationId,
                userRecord: parsedMessage.headers.userRecord
              },
             payload:{
              status: 'success',
              data: {
                payments
              }}};
              await this.producerService.sendMessage(successMessage);
          }catch(error){
            const errorMessage: GenericMessage<PaymentFetchPayload> = {
              headers: {
                type: 'FetchLoanIdPayments',
                topic: PAYMENT_FETCH_RESPONSE,
                correlationId: parsedMessage.headers.correlationId,
                userRecord: parsedMessage.headers.userRecord
              },
              payload:{
                status: 'Error',
                data: {
                  error: error.message
                }
              }
            }
            await this.producerService.sendMessage(errorMessage);
          }
          
            break;
          default:
            console.warn('Received message from unknown: ' + topic);
            break;
        }
      },
    });
  }
  async onApplicationShutdown() {
    await this.consumer.disconnect();
  }
}
