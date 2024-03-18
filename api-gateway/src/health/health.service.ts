import { Injectable } from '@nestjs/common';
import { HealthConsumer } from './health.consumer';
import { ProducerService } from '../kafka/producer.service';
import {
  GenerateUniqueId,
  HEALTH_REQUEST,
  HealthMessageRequest,
  IsHealthMessageRequest,
  ServerStatusPayload,
} from '../shared-definitions/types-dto-constants';

@Injectable()
export class HealthService {
  constructor(
    private readonly producerService: ProducerService,
    private readonly healthConsumer: HealthConsumer,
  ) {}

  async createHealthRequestMessage(): Promise<ServerStatusPayload> {
    const correlationId = GenerateUniqueId();

    const message: HealthMessageRequest = {
      headers: {
        topic: HEALTH_REQUEST,
        type: 'CreateHealthRequest',
        correlationId: correlationId,
        userRecord: null,
      },
      payload: null,
    };

    if (IsHealthMessageRequest(message)) {
      await this.producerService.sendMessage(message);

      const responsesArray =
        this.healthConsumer.registerResponseHandler(correlationId);

      return await this.healthConsumer.waitForResponse(
        correlationId,
        responsesArray,
      );
    }

    throw new Error('[API Gateway] Health Request Malformed');
  }
}
