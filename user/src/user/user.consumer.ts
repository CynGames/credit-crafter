import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka } from 'kafkajs';
import {
  FINANCIAL_DATA_CREATE_REQUEST,
  FINANCIAL_DATA_FETCH_REQUEST,
  GenericMessage,
  USER_CREATE_REQUEST,
  USER_FETCH_REQUEST,
} from '../shared-definitions/types-dto-constants';
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
            ) as GenericMessage<any>;
            // const typedMessage = PayloadTypeExtractor(parsedMessage);

            console.log(USER_CREATE_REQUEST);
            console.log(parsedMessage, null);

            await this.userService.createUser(parsedMessage);

            // const { userRecord, correlationId } = parsedMessage.headers;
            //
            // await this.producerService.constructResponse(
            //   correlationId,
            //   userRecord,
            // );

            break;
          case USER_FETCH_REQUEST:
            parsedMessage = JSON.parse(
              message.value.toString(),
            ) as GenericMessage<any>;

            const type = parsedMessage.headers.type;

            console.log(USER_FETCH_REQUEST);
            console.log(parsedMessage, null);

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
            // const typedMessage = PayloadTypeExtractor(parsedMessage);

            console.log(FINANCIAL_DATA_CREATE_REQUEST);
            console.log(parsedMessage, null);

            await this.userService.createFinancialData(parsedMessage);
            break;
          case FINANCIAL_DATA_FETCH_REQUEST:
            parsedMessage = JSON.parse(
              message.value.toString(),
            ) as GenericMessage<any>;

            // const type = parsedMessage.headers.type;

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

// import {
//   Injectable,
//   OnApplicationShutdown,
//   OnModuleInit,
// } from '@nestjs/common';
// import { Consumer, Kafka } from 'kafkajs';
// import {
//   PayloadTypeExtractor,
//   SpecificMessage,
//   USER_CREATE_REQUEST,
//   USER_FETCH_REQUEST,
// } from '../shared-definitions/types-dto-constants';
// import { UserService } from './user.service';
//
// @Injectable()
// export class UserConsumer implements OnModuleInit, OnApplicationShutdown {
//   private readonly kafka = new Kafka({
//     brokers: ['localhost:9092'],
//     clientId: 'user-service',
//   });
//
//   private consumer: Consumer;
//   private readonly responseHandlers = new Map<
//     string,
//     (responses: any) => void
//   >();
//
//   constructor(private readonly userService: UserService) {
//     this.consumer = this.kafka.consumer({
//       groupId: 'credit-crafter-user',
//       sessionTimeout: 6000,
//     });
//   }
//
//   async onModuleInit() {
//     try {
//       await this.consumer.connect();
//       await this.consumer.subscribe({
//         topics: [USER_CREATE_REQUEST, USER_FETCH_REQUEST],
//       });
//
//       await this.listenForMessages();
//     } catch (error) {
//       console.error('Failed to init Kafka Consumer', error);
//     }
//   }
//
//   async onApplicationShutdown() {
//     try {
//       await this.consumer.disconnect();
//     } catch (error) {
//       console.error('Failed to disconnect Kafka Consumer', error);
//     }
//   }
//
//   async listenForMessages() {
//     await this.consumer.run({
//       eachMessage: async ({ message }) => {
//         await this.processMessage(message);
//       },
//     });
//   }
//
//   public async processMessage(message: any) {
//     try {
//       console.log('[API GATEWAY] Received User Response');
//       const parsedMessage = JSON.parse(
//         message.value.toString(),
//       ) as SpecificMessage;
//       // const typedMessage = PayloadTypeExtractor(parsedMessage);
//
//       const { headers, payload } = parsedMessage;
//       const handler = this.responseHandlers.get(headers.correlationId);
//
//       if (handler) {
//         console.log('[API GATEWAY] Handler found. Resolving promise...');
//         handler(payload);
//       }
//     } catch (error) {
//       console.error('Failed to process message: ', error);
//     }
//   }
//
//   public createUserHandler(correlationId: string): string {
//     let output = '';
//
//     this.responseHandlers.set(correlationId, async (payload) => {
//       console.log('[API GATEWAY] Processing Create User Response...');
//       await this.userService.create(payload);
//
//       output = payload;
//     });
//
//     return output;
//   }
//
//   public fetchUserEmailHandler(correlationId: string): any[] {
//     const output = [];
//
//     this.responseHandlers.set(correlationId, async (payload) => {
//       console.log('[API GATEWAY] Processing Fetch User Response...');
//       await this.userService.findOneByEmail(payload);
//
//       output.push(payload);
//     });
//
//     return output;
//   }
//
//   public fetchUserIdHandler(correlationId: string): any[] {
//     const output = [];
//
//     this.responseHandlers.set(correlationId, async (payload) => {
//       console.log('[API GATEWAY] Processing Fetch User Response...');
//       await this.userService.findOneById(payload);
//
//       output.push(payload);
//     });
//
//     return output;
//   }
//
//   public async waitForCreateResponse(
//     correlationId: string,
//     response: string,
//   ): Promise<UserCreatePayload> {
//     console.log('[API GATEWAY] Waiting for response...');
//     console.log(response);
//
//     return new Promise((resolve) => {
//       const timeoutId = setTimeout(() => {
//         resolve({ data: { status: 'Unable to Create' } });
//         this.responseHandlers.delete(correlationId);
//         console.log('[API GATEWAY] Promised Resolved!');
//       }, 3000);
//
//       if (response) {
//         clearTimeout(timeoutId);
//         resolve({ data: { status: 'User Created' } });
//         this.responseHandlers.delete(correlationId);
//         console.log('[API GATEWAY] Promised Resolved!');
//       }
//     });
//   }
//
//   public async waitForFetchResponse(
//     correlationId: string,
//     responses: UserFetchResponseDto[],
//   ): Promise<UserFetchPayload> {
//     console.log('[API GATEWAY] Waiting for response...');
//     console.log(responses);
//
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({ data: responses });
//         this.responseHandlers.delete(correlationId);
//         console.log('[API GATEWAY] Promised Resolved!');
//       }, 3000);
//     });
//   }
// }
