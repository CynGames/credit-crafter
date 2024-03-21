import { ApiProperty } from '@nestjs/swagger';

export class BadRequestDto {
  @ApiProperty({
    example: '400',
  })
  statusCode: number;

  @ApiProperty({
    example: 'reason',
  })
  message: string;

  @ApiProperty({
    example: 'Bad request',
  })
  error: string;
}
