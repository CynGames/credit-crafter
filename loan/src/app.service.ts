import { Injectable } from '@nestjs/common';
import { ProducerService } from './kafka/producer.service';
import {
  HEALTH_RESPONSE,
  HealthMessageRequest,
  HealthMessageResponse,
  IsHealthMessageResponse,
  ServerStatus,
} from './dto/types-dto-constants';

@Injectable()
export class AppService {
  constructor(private readonly producerService: ProducerService) {}

  async handleHealthCheckResponse(
    typedMessage: HealthMessageRequest,
  ): Promise<void> {
    console.log(`[LOAN SERVICE] Health Check Request Received`);

    const state: ServerStatus = this.getCurrentServerStatus();

    const responseMessage: HealthMessageResponse = {
      headers: {
        ...typedMessage.headers,
        topic: HEALTH_RESPONSE,
        type: 'CreateHealthResponse',
        correlationId: typedMessage.headers.correlationId,
      },
      payload: state,
    };

    if (IsHealthMessageResponse(responseMessage)) {
      await this.producerService.sendMessage(responseMessage);
    } else {
      throw new Error('[Loan Service] Malformed Health Response');
    }
  }

  private getCurrentServerStatus(): ServerStatus {
    return {
      service: 'Loan Service',
      status: 'OK',
    };
  }
}
