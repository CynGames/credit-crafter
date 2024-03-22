import { ApiProperty } from '@nestjs/swagger';

export class LoanCreateResponseDto {
  id?: string;
  error?: Error;
}

export class LoanCreatePayload {
  @ApiProperty({ example: 'success', description: 'Success message' })
  status: string;

  @ApiProperty({ type: LoanCreateResponseDto, description: 'Loan data' })
  data: LoanCreateResponseDto;
}

export type LoanFetchPayload = {
  status: string;
  data: {
    loans: any[];
  };
};

export class LoanUpdateResponse {
  loanId: string;
  state: string;
  error?: string;
}

export class LoanUpdatePayload {
  @ApiProperty({ example: 'success', description: 'Success message' })
  status: string;

  @ApiProperty({ type: LoanUpdateResponse, description: 'Loan data' })
  data: LoanUpdateResponse;
}

export type LoanFetchRespond = {
  loan: any;
};
export type LoanUpdateRequest = {
  loanId: string;
  state: string;
};
