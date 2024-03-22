import { ApiProperty } from '@nestjs/swagger';

export class LoanFetchPayload {
  @ApiProperty({ example: 'success', description: 'Success message' })
  status: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'object' },
    description: 'Loan data',
  })
  data: { loans: any[] };
}
