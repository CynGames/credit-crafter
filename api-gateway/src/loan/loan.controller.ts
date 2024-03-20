import {
  Controller,
  Post,
  Req,
  UseGuards,
  Get,
  Body,
  Param,
  Put
} from '@nestjs/common';
import { LoanService } from './loan.service';
import { CreateLoanDTO } from 'src/loan/dto/creaate-loan-dto';
import { FirebaseAuthGuard } from '../auth/guards/auth.guard';
import { RequestUserDTO } from '../shared-definitions/types-dto-constants';
import { response } from 'express';

@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post('/create')
  @UseGuards(FirebaseAuthGuard)
  async create(@Req() user: RequestUserDTO, @Body() loan: CreateLoanDTO) {
    try {
      const response = await this.loanService.createLoan(loan, user);

      return response
    } catch (error) {
      return {
        message: 'Error creating loan',
      };
    }
  }
  @Get('user/:userId')
  @UseGuards(FirebaseAuthGuard)
  async getLoanByUserId(@Req() user: RequestUserDTO, @Param() userId: string) {
    try {
      const response: any = await this.loanService.getLoanByUserId(
        userId,
        user,
      );
      // console.log('controller: ');
      // console.log(response);
      
      
      return response;
    } catch (error) {
      return {
        message: 'Error getting user',
      };
    }
  }
  @Put('/changeState')
  @UseGuards(FirebaseAuthGuard)
  async updateState(@Req() user: RequestUserDTO, @Body() body: {loan_id: string, state: string}){
    try{
      const response = await this.loanService.updateLoanState(body.loan_id, body.state, user);
      if(response.status != 'success'){
        if(response.data.error){
          throw new Error(response.data.error);
        }
        else{
        throw new Error('unsuccessful update');
        }
      }
      return response;
    }catch(error){
        return {
          message: `Error Updating: ${error.message}`
        }
    }
  }
  
}
