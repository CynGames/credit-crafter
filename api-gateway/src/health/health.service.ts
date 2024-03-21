import { Injectable } from '@nestjs/common';
import { HealthConsumer } from './health.consumer';
import { ProducerService } from '../kafka/producer.service';
import {
  GenerateUniqueId,
  GenericMessage,
  HEALTH_REQUEST,
} from '../shared-definitions/types-dto-constants';
import { ServerStatusPayload } from './dtos/fetch-server-status.dto';

@Injectable()
export class HealthService {
  constructor(
    private readonly producerService: ProducerService,
    private readonly healthConsumer: HealthConsumer,
  ) {}

  async createHealthRequestMessage(): Promise<ServerStatusPayload> {
    const correlationId = GenerateUniqueId();

    const message: GenericMessage<void> = {
      headers: {
        topic: HEALTH_REQUEST,
        type: 'HealthMessageRequest',
        correlationId: correlationId,
        userRecord: null,
      },
      payload: null,
    };

    await this.producerService.sendMessage(message);

    const responsesArray =
      this.healthConsumer.registerResponseHandler(correlationId);

    return await this.healthConsumer.waitForResponse(
      correlationId,
      responsesArray,
    );
  }
}
