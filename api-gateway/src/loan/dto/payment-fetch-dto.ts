import { ApiProperty } from '@nestjs/swagger';

export class PaymentFetch {
  @ApiProperty({ example: 'success', description: 'Success message' })
  status: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'object' },
    description: 'Payment data',
  })
  data: {
    payments: any[];
    error?: string;
  };
}
