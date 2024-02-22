import { Injectable } from '@nestjs/common';
import { ProducerService } from './kafka/producer.service';
import { ConsumerService } from './kafka/consumer.service';

@Injectable()
export class AppService {
  constructor(
    private readonly producerService: ProducerService,
    private readonly consumerService: ConsumerService,
  ) {}

  async createUserMessage(messageBody: any) {
    await this.producerService.sendMessage('user-message', [messageBody]);
  }

  async createLoanMessage(messageBody: any) {
    console.log('Executing createLoanMessage service method');

    const correlationId = this.generateUniqueId();

    const message = {
      ...messageBody,
      correlationId,
      responseTopic: 'loan-response',
    };

    await this.producerService.sendMessage('loan-request', [message]);

    return await this.consumerService.waitForResponse(correlationId);
  }

  private generateUniqueId() {
    return 'unique-id-' + Math.random().toString(36).substr(2, 9);
  }
}
