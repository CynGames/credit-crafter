import { Injectable } from '@nestjs/common';
import { ProducerService } from './kafka/producer.service';

@Injectable()
export class AppService {
  constructor(private readonly producerService: ProducerService) {}

  async createUserMessage(topic: string, messageBody: any) {
    await this.producerService.sendMessage(topic, [messageBody]);
  }
}
