import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import {
  GenericMessage,
  FINANCIAL_DATA_CREATE_REQUEST,
  FINANCIAL_DATA_FETCH_REQUEST,
  USER_CREATE_REQUEST,
  USER_FETCH_REQUEST,
} from '../shared-definitions/types-dto-constants';
import { Kafka } from 'kafkajs';
import { UserService } from './user.service';
import { ProducerService } from '../kafka/producer.service';

@Injectable()
export class UserConsumer implements OnModuleInit, OnApplicationShutdown {
  constructor(
    private readonly userService: UserService,
    private readonly producerService: ProducerService,
  ) {}

  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
    clientId: 'user-module',
  });

  private readonly consumer = this.kafka.consumer({
    groupId: 'user-service-group',
    sessionTimeout: 6000,
  });

  async onModuleInit() {
    const topics = [
      USER_CREATE_REQUEST,
      USER_FETCH_REQUEST,
      FINANCIAL_DATA_CREATE_REQUEST,
      FINANCIAL_DATA_FETCH_REQUEST,
    ];

    await this.consumer.connect();
    await this.consumer.subscribe({ topics });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log('[USER SERVICE] Received response');
        let parsedMessage = null;

        switch (topic) {
          case USER_CREATE_REQUEST:
            parsedMessage = JSON.parse(
              message.value.toString(),
            ) as GenericMessage<void>;

            console.log(USER_CREATE_REQUEST);
            console.log(parsedMessage, null);

            await this.userService.createUser(parsedMessage);
            break;
          case USER_FETCH_REQUEST:
            parsedMessage = JSON.parse(
              message.value.toString(),
            ) as GenericMessage<any>;

            console.log(USER_FETCH_REQUEST);
            console.log(parsedMessage, null);

            const type = parsedMessage.headers.type;

            switch (type) {
              case 'FetchUsers':
                await this.userService.findAllUsers(parsedMessage);
                break;
              case 'FetchIdUser':
                await this.userService.findOneById(parsedMessage);
                break;
              case 'FetchEmailUser':
                await this.userService.findOneByEmail(parsedMessage);
                break;
              default:
                console.warn('Received message from unknown type: ' + type);
                break;
            }
            break;
          case FINANCIAL_DATA_CREATE_REQUEST:
            parsedMessage = JSON.parse(
              message.value.toString(),
            ) as GenericMessage<any>;

            console.log(FINANCIAL_DATA_CREATE_REQUEST);
            console.log(parsedMessage, null);

            await this.userService.createFinancialData(parsedMessage);
            break;
          case FINANCIAL_DATA_FETCH_REQUEST:
            parsedMessage = JSON.parse(
              message.value.toString(),
            ) as GenericMessage<any>;

            console.log(FINANCIAL_DATA_FETCH_REQUEST);
            console.log(parsedMessage, null);

            await this.userService.fetchFinancialData(parsedMessage);
            break;
          default:
            console.warn('Received message from unknown topic: ' + topic);
            break;
        }
      },
    });
  }

  async onApplicationShutdown() {
    await this.consumer.disconnect();
  }
}
