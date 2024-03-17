import { Controller, Post, Req, UseGuards, Get, Body } from '@nestjs/common';
import { LoanService } from '../loan.service';
import { FirebaseAuthGuard } from 'src/auth/guard/auth.guard';
import { RequestUserDto } from 'src/auth/dto/request-user.dto';
import { CreateLoanDTO } from 'src/dto/creaate-loan-dto';
import { elementAt } from 'rxjs';

@Controller('loan')
export class LoanController {
    constructor(private readonly loanService: LoanService){}

  @Post('/create')
  @UseGuards(FirebaseAuthGuard)
  async create(@Req(){ user }: RequestUserDto, @Body() loan: CreateLoanDTO){
    try{
    const loanId = this.loanService.createLoan(loan, user);
    let response: any;
    if(loanId){
       response = {
        message: "created",
        loanId: loanId
      }
    }
    else{
      throw new Error('no loanId returned');
    }
    return response
  }catch(error){
    return {
      message: "Error creating loan"
    }
  }
  }
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