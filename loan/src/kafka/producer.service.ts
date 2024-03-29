import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka } from 'kafkajs';

import {
  MessageTypes,
  GenericMessage,
  UserDTO,
} from 'src/shared-definitions/types-dto-constants';

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
    clientId: 'credit-crafter-loan',
  });

  private readonly producer = this.kafka.producer();

  async onModuleInit() {
    await this.producer.connect();
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }
  async constructResponse(
    correlationId: string,
    userRecord: UserDTO,
    type: MessageTypes,
    topic: string,
    createdId: string,
  ) {
    const message: GenericMessage<any> = {
      headers: {
        type: type,
        topic: topic,
        correlationId: correlationId,
        userRecord: userRecord,
      },
      payload: {
        data: {
          id: createdId,
        },
      },
    };
    console.log('producer message: ' + message);

    return await this.sendMessage(message);
  }
  async constructFetchResponse(
    correlationId: string,
    userRecord: UserDTO,
    type: MessageTypes,
    topic: string,
    array: any[],
  ) {
    const message: GenericMessage<any> = {
      headers: {
        type: type,
        topic: topic,
        correlationId: correlationId,
        userRecord: userRecord,
      },
      payload: {
        query: {
          status: 'success',
          data: array,
        },
      },
    };
    console.log('producer message: ' + message);

    return await this.sendMessage(message);
  }
  async sendMessage<T = any>(genericMessage: GenericMessage<T>) {
    const topic = genericMessage.headers.topic;
    const messages: { value: string }[] = [
      { value: JSON.stringify(genericMessage) },
    ];

    console.log('GenericMessage...');
    console.log(genericMessage);

    console.log('Message being sent...');
    console.log(messages);

    await this.producer.send({
      topic,
      messages,
    });

    console.log(`[LOAN SERVICE PRODUCER] Message sent to ${topic}`);
  }
}
