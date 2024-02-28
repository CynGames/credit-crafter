import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ServerStatusPayload } from './dto/types-dto-constants';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  async getHealthStatus(): Promise<ServerStatusPayload> {
    return await this.appService.createHealthRequestMessage();
  }
}
