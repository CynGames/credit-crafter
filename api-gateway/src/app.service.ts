import { Injectable } from '@nestjs/common';
import { ProducerService } from './kafka/producer.service';
import { HealthService } from './kafka/health.service';
import {
  GenerateUniqueId,
  HEALTH_REQUEST,
  HealthMessageRequest,
  IsHealthMessageRequest,
  ServerStatusPayload,
} from './dto/types-dto-constants';

@Injectable()
export class AppService {
  constructor(
    private readonly producerService: ProducerService,
    private readonly healthService: HealthService,
  ) {}

  async createHealthRequestMessage(): Promise<ServerStatusPayload> {
    const correlationId = GenerateUniqueId();

    const message: HealthMessageRequest = {
      headers: {
        topic: HEALTH_REQUEST,
        type: 'CreateHealthRequest',
        correlationId: correlationId,
      },
      payload: null,
    };

    if (IsHealthMessageRequest(message)) {
      await this.producerService.sendMessage(message);
      return await this.healthService.waitForResponse(correlationId);
    }

    throw new Error('[API Gateway] Health Request Malformed');
  }
}
