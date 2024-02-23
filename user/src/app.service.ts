import { Injectable } from '@nestjs/common';
import { ProducerService } from './kafka/producer.service';

@Injectable()
export class AppService {
  constructor(private readonly producerService: ProducerService) {}

  async handleMessage(message: string): Promise<void> {
    await this.producerService.sendMessage('loan-message', [
      { value: `${message} | And this is a modification for the loan service` },
    ]);

    console.log(`[USER SERVICE] Message Received: ${message}`);
  }

  async handleHealthCheckResponse(message: string) {
    console.log(`[USER SERVICE] Health Check Request Received`);

    const state = {
      service: 'User Service',
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
