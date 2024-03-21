import { ApiProperty } from '@nestjs/swagger';
import { FinancialDataDTO } from './financial-data.dto';

export class FetchFinancialDataDTO {
  @ApiProperty({ example: 'success', description: 'Success message' })
  status: string;

  @ApiProperty({ type: FinancialDataDTO, description: 'Financial data' })
  data: FinancialDataDTO;
}
