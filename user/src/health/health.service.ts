import { Injectable } from '@nestjs/common';
import { ProducerService } from '../kafka/producer.service';
import {
  HEALTH_RESPONSE,
  ServerStatus,
} from '../shared-definitions/types-dto-constants';

@Injectable()
export class HealthService {
  constructor(private readonly producerService: ProducerService) {}

  async handleHealthCheckResponse(typedMessage: any): Promise<void> {
    console.log(`[USER SERVICE] Health Check Request Received`);

    const state: ServerStatus = this.getCurrentServerStatus();

    const responseMessage = {
      headers: {
        ...typedMessage.headers,
        topic: HEALTH_RESPONSE,
        type: 'CreateHealthResponse',
        correlationId: typedMessage.headers.correlationId,
      },
      payload: state,
    };

    await this.producerService.sendMessage(responseMessage);
  }

  private getCurrentServerStatus(): ServerStatus {
    return {
      service: 'User Service',
      status: 'OK',
    };
  }
}
