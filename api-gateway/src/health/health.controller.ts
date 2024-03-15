import { Controller, Get } from '@nestjs/common';
import { ServerStatusPayload } from '../shared-definitions/types-dto-constants';
import { HealthService } from './health.service';

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('/health')
  async getHealthStatus(): Promise<ServerStatusPayload> {
    return await this.healthService.createHealthRequestMessage();
  }
}
