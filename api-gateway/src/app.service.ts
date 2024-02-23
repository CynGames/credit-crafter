import { Injectable } from '@nestjs/common';
import { ProducerService } from './kafka/producer.service';
import { ConsumerService } from './kafka/consumer.service';
import { HealthService } from './kafka/health.service';

@Injectable()
export class AppService {
  constructor(
    private readonly producerService: ProducerService,
    private readonly consumerService: ConsumerService,
    private readonly healthService: HealthService,
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
    };

    await this.producerService.sendMessage('loan-request', [message]);

    return await this.consumerService.waitForResponse(correlationId);
  }

  async createHealthRequestMessage() {
    console.log('Executing createHealthRequestMessage service method');

    const correlationId = this.generateUniqueId();
    const message = {
      correlationId,
    };

    await this.producerService.sendMessage('health-check', [message]);

    return await this.healthService.waitForResponse(correlationId);
  }

  private generateUniqueId() {
    return 'unique-id-' + Math.random().toString(16).substr(4, 10);
  }
}
