import { ApiProperty } from '@nestjs/swagger';
import { FinancialDataDTO } from './financial-data.dto';

export class CreateFinancialDataDTO {
  @ApiProperty({ example: 'success', description: 'Success message' })
  success: string;

  @ApiProperty({ type: FinancialDataDTO, description: 'Financial data' })
  financialData: FinancialDataDTO;
}
