import { Controller, Get } from '@nestjs/common';
import { ServerStatusPayload } from '../shared-definitions/types-dto-constants';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('')
  async getHealthStatus(): Promise<ServerStatusPayload> {
    return await this.healthService.createHealthRequestMessage();
  }
}
