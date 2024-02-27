import { Injectable } from '@nestjs/common';
import { ProducerService } from './kafka/producer.service';
import {
  HealthMessageRequest,
  HealthMessageResponse,
  ServerStatus,
} from './dto/generic.dto';
import { isHealthMessageResponse } from './dto/type.guards';

@Injectable()
export class AppService {
  constructor(private readonly producerService: ProducerService) {}

  async handleHealthCheckResponse(
    typedMessage: HealthMessageRequest,
  ): Promise<void> {
    console.log(`[USER SERVICE] Health Check Request Received`);

    const state: ServerStatus = this.getCurrentServerStatus();

    const responseMessage: HealthMessageResponse = {
      headers: {
        ...typedMessage.headers,
        topic: 'health-response',
        type: 'CreateHealthResponse',
        correlationId: typedMessage.headers.correlationId,
      },
      payload: state,
    };

    if (isHealthMessageResponse(responseMessage)) {
      await this.producerService.sendMessage(responseMessage);
    } else {
      throw new Error('[USER SERVICE] Malformed Health Response');
    }
  }

  private getCurrentServerStatus(): ServerStatus {
    return {
      service: 'User Service',
      status: 'OK',
    };
  }
}
