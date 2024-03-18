import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { HealthService } from './health.service';
import {
  HEALTH_REQUEST,
  IsHealthMessageRequest,
  PayloadTypeExtractor,
} from '../shared-definitions/types-dto-constants';

@Injectable()
export class HealthConsumer implements OnModuleInit, OnApplicationShutdown {
  constructor(private readonly appService: HealthService) {}

  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
    clientId: 'credit-crafter-user-health',
  });

  private readonly consumer = this.kafka.consumer({
    groupId: 'user-health-service-group',
    sessionTimeout: 6000,
  });

  async onModuleInit() {
    const topics = [HEALTH_REQUEST];

    await this.consumer.connect();
    await this.consumer.subscribe({ topics });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        switch (topic) {
          case HEALTH_REQUEST:
            console.log(
              '[USER SERVICE] Received message from health-check:' +
                message.value.toString(),
            );

            const parsedMessage = JSON.parse(message.value.toString());
            const typedMessage = PayloadTypeExtractor(parsedMessage);

            if (IsHealthMessageRequest(typedMessage)) {
              await this.appService.handleHealthCheckResponse(typedMessage);
            }
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
