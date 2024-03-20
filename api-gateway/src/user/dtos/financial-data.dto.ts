import { ApiProperty } from '@nestjs/swagger';

export class FinancialDataDTO {
  @ApiProperty({ example: 720, description: 'Credit score of the user.' })
  creditScore?: number;

  @ApiProperty({ example: 5000, description: 'Monthly income of the user.' })
  income?: number;

  @ApiProperty({ example: 2000, description: 'Monthly expenses of the user.' })
  expenses?: number;
}
