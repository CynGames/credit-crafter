import { Controller, Post, Req, UseGuards, Get } from '@nestjs/common';
import { LoanService } from '../loan.service';

@Controller('loan')
export class LoanController {
    constructor(private readonly loanService: LoanService){}

   
}
export type LoanCreatePayload = {
    data: LoanCreateResponseDto;
  };
  
  export type LoanFetchPayload = {
    data: LoanFetchResponseDto[];
  };
  
  export type LoanCreateResponseDto = {
    status: string;
    error?: Error;
  };
  
  export type LoanFetchResponseDto = {
    status: string;
    fetchedLoan?: any;
    error?: Error;
  };