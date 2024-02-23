import { Injectable } from '@nestjs/common';
import { ProducerService } from './kafka/producer.service';

@Injectable()
export class AppService {
  constructor(private readonly producerService: ProducerService) {}

  async handleLoanMessage(message: string) {
    console.log(`[LOAN SERVICE] Message Received: ${message}`);
  }

  async handleLoanResponse(message: string) {
    console.log(`[LOAN SERVICE] Message Received: ${message}`);

    const response = 10;

    const parsedMessage = JSON.parse(message);

    const responseMessage = {
      ...parsedMessage,
      value: {
        correlationId: parsedMessage.correlationId,
        value: response,
      },
    };

    console.log(
      `[LOAN SERVICE RESPONSE 2] Message State: ${JSON.stringify(responseMessage)}`,
    );

    await this.producerService.sendMessage('response-to-api-gateway', [
      responseMessage,
    ]);
  }

  async handleHealthCheckResponse(message: string) {
    console.log(`[LOAN SERVICE] Health Check Request Received`);

    const state = {
      service: 'Loan Service',
      status: 'OK',
    };

    const responseMessage = {
      value: {
        correlationId: JSON.parse(message).correlationId,
        value: state,
      },
    };

    console.log(JSON.stringify(responseMessage));

    await this.producerService.sendMessage('health-check-response', [
      responseMessage,
    ]);
  }
}
