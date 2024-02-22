import { Injectable } from '@nestjs/common';
import { ProducerService } from './kafka/producer.service';

@Injectable()
export class AppService {
  constructor(private readonly producerService: ProducerService) {}

  async handleLoanMessage(message: string) {
    console.log(`[LOAN SERVICE MESSAGE] Message Received: ${message}`);
  }

  async handleLoanResponse(message: string) {
    console.log(`[LOAN SERVICE RESPONSE] Message Received: ${message}`);

    const response = 10;

    const parsedMessage = JSON.parse(message);

    const responseMessage = {
      value: JSON.stringify({
        correlationId: parsedMessage.correlationId,
        value: response,
      }),
    };

    console.log(
      `[LOAN SERVICE RESPONSE 2] Message State: ${JSON.stringify(responseMessage)}`,
    );

    await this.producerService.sendMessage(parsedMessage.responseTopic, [
      responseMessage,
    ]);
  }
}
