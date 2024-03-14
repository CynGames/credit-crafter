import { Injectable } from '@nestjs/common';
import { ProducerService } from './kafka/producer.service';
import { HealthService } from './kafka/health.service';
import {
  GenerateUniqueId,
  HEALTH_REQUEST,
  HealthMessageRequest,
  IsHealthMessageRequest,
  ServerStatusPayload,
  SpecificMessage,
  UserRecord,
} from './dto/types-dto-constants';
import { AuthService } from './auth/auth.service';

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
        userRecord: null,
      },
      payload: null,
    };

    if (IsHealthMessageRequest(message)) {
      await this.producerService.sendMessage(message);

      const responsesArray =
        this.healthService.registerResponseHandler(correlationId);

      return await this.healthService.waitForResponse(
        correlationId,
        responsesArray,
      );
    }

    throw new Error('[API Gateway] Health Request Malformed');
  }
}
