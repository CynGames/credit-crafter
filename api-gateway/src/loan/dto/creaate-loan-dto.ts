import { IsString, IsNumber, IsInt, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLoanDTO {
  @IsString()
  user_id: string;

  @IsNumber()
  amount: number;

  @IsInt()
  installments: number;

  @IsDate()
  next_installment_date: Date;

  @IsDate()
  end_date: Date;

  @IsString()
  loan_type: string;
}

// remove this
export class PaymentCreateResponse {
  paymentId: string;
  error?: string;
}

export class PaymentCreatePayload {
  @ApiProperty({ example: 'success', description: 'Success message' })
  status: string;

  @ApiProperty({ type: PaymentCreateResponse, description: 'Payment data' })
  data: { paymentId: string; error?: string };
}
