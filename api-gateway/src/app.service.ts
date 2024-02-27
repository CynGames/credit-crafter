import { Injectable } from '@nestjs/common';
import { ProducerService } from './kafka/producer.service';
import { HealthService } from './kafka/health.service';
import { HealthMessageRequest, ServerStatusPayload } from './dto/generic.dto';
import { generateUniqueId } from './utils/utils';
import { isHealthMessageRequest } from './dto/type.guards';

@Injectable()
export class AppService {
  constructor(
    private readonly producerService: ProducerService,
    private readonly healthService: HealthService,
  ) {}

  async createHealthRequestMessage(): Promise<ServerStatusPayload> {
    const correlationId = generateUniqueId();

    const message: HealthMessageRequest = {
      headers: {
        topic: 'health-request',
        type: 'CreateHealthRequest',
        correlationId: correlationId,
      },
      payload: null,
    };

    if (isHealthMessageRequest(message)) {
      await this.producerService.sendMessage(message);
      return await this.healthService.waitForResponse(correlationId);
    }

    throw new Error('[API Gateway] Health Request Malformed');
  }
}
