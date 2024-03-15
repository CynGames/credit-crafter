import {
    Injectable,
    OnApplicationShutdown,
    OnModuleInit,
  } from '@nestjs/common';
  import { Kafka } from 'kafkajs';
  import {
      LOAN_CREATE_RESPONSE,
    LOAN_FETCH_REQUEST,
    LOAN_FETCH_RESPONSE,
    PAYMENT_CREATE_RESPONSE,
    
  } from '../shared-definitions/types-dto-constants';
  import { LoanService } from './loan.service';
import { log } from 'console';

  @Injectable()
  export class LoanConsumer implements OnModuleInit, OnApplicationShutdown {
    constructor(private readonly loanService: LoanService){}

    private readonly kafka = new Kafka({
        brokers: ['localhost:9092'],
        clientId: 'loan-module',
    });

    private readonly consumer = this.kafka.consumer({
        groupId: 'loan-service-group',
        sessionTimeout: 6000,
    });

    async onModuleInit() {
        const topics = [LOAN_CREATE_RESPONSE, LOAN_FETCH_RESPONSE, PAYMENT_CREATE_RESPONSE];

        await this.consumer.connect();
        await this.consumer.subscribe({ topics });

        await this.consumer.run({
            eachMessage: async ({topic, partition, message }) =>{
               switch (topic) {
                case LOAN_CREATE_RESPONSE:
                    const parsedMessage = JSON.parse(message.value.toString());
                    await this.loanService.create(parsedMessage);
                break;
                case LOAN_FETCH_REQUEST:
                    await this.loanService.getLoansByUser(message.value.toString());
                    break;
               }
                
            }
        })
    }
    async onApplicationShutdown() {
        await this.consumer.disconnect();
    }
  }