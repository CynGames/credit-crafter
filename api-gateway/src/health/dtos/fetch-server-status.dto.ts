import { ApiProperty } from '@nestjs/swagger';

export class ServerStatus {
  @ApiProperty({ example: 'Users Service', description: 'Service name' })
  service: string;

  @ApiProperty({ example: 'OK', description: 'Service status' })
  status: string;
}

export class ServerStatusPayload {
  @ApiProperty({ type: ServerStatus, description: 'Server status data' })
  data: ServerStatus[];
}
