import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async createUserMessage(@Body() messageBody: any) {
    await this.appService.createUserMessage([messageBody]);
    return { status: 'Message sent to User from API Gateway!' };
  }

  @Post('/loans')
  async getAmountOfLoansMessage(@Body() messageBody: any) {
    console.log('Executing getAmountOfLoansMessage controller');

    const processingResult =
      await this.appService.createLoanMessage(messageBody);

    return { data: processingResult };
  }

  @Get('/health')
  async getHealthStatus() {
    console.log('Executing getHealthStatus controller');

    const otherServicesStatus =
      await this.appService.createHealthRequestMessage();

    const currentServiceStatus = {
      service: 'API Gateway',
      status: 'OK',
    };

    return {
      data: [currentServiceStatus, ...otherServicesStatus],
    };
  }
}
