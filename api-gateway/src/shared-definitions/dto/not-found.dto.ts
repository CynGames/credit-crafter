import { ApiProperty } from '@nestjs/swagger';

export class NotFoundDto {
  @ApiProperty({
    example: '404',
  })
  statusCode: number;

  @ApiProperty({
    example: 'Not Found',
  })
  message: string;
}
