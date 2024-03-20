import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { ApiTags } from '@nestjs/swagger';
import { ServerStatusPayload } from './dtos/fetch-server-status.dto';
import { AppApiOkResponse } from '../decorators/app-api.decorators';

@ApiTags('Health Controller')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @AppApiOkResponse({ type: ServerStatusPayload })
  @Get('')
  async getHealthStatus(): Promise<ServerStatusPayload> {
    return await this.healthService.createHealthRequestMessage();
  }
}
