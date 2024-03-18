import { Controller, Post, Req, UseGuards, Get, Body, Param } from '@nestjs/common';
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
    const response = await this.loanService.createLoan(loan, user);
    
    return response.data
  }catch(error){
    return {
      message: "Error creating loan"
    }
  }
  }
  @Get('user/:userId')
  @UseGuards(FirebaseAuthGuard)
  async getLoanByUserId(@Req(){ user }: RequestUserDto, @Param() userId: string){
    try{
      const response: any = await this.loanService.getLoanByUserId(userId, user);
      return response.query;
    }catch(error){
      return{
        message: 'Error getting user'
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
    id?: string
    error?: Error;
  };
  
  export type LoanFetchResponseDto = {
    status: string;
    loans?: any[]
  };