import {
  Controller,
  Post,
  Req,
  UseGuards,
  Get,
  Body,
  Param,
  Put,
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
      if (response.data.error) {
        throw new Error(response.data.error.toString());
      }
      return response;
    } catch (error) {
      return {
        status: 'Error',
        message: error.message,
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
      if (response.data.error) {
        throw new Error(response.data.error.toString());
      }
      return response;
    } catch (error) {
      return {
        status: 'Error',
        message: error.message,
      };
    }
  }
  @Put('/changeState')
  @UseGuards(FirebaseAuthGuard)
  async updateState(
    @Req() user: RequestUserDTO,
    @Body() body: { loan_id: string; state: string },
  ) {
    try {
      const response = await this.loanService.updateLoanState(
        body.loan_id,
        body.state,
        user,
      );
      if (response.status != 'success') {
        if (response.data.error) {
          throw new Error(response.data.error);
        } else {
          throw new Error('unsuccessful update');
        }
      }
      return response;
    } catch (error) {
      return {
        message: `Error Updating: ${error.message}`,
      };
    }
  }
  @Post('/payment/create')
  @UseGuards(FirebaseAuthGuard)
  async createPayment(
    @Req() user: RequestUserDTO,
    @Body() body: { loan_id: string; amount_paid: number },
  ) {
    try {
      const response = await this.loanService.createPayment(
        body.loan_id,
        body.amount_paid,
        user,
      );
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      return response;
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }
  @Get('/payment/:loan_id')
  @UseGuards(FirebaseAuthGuard)
  async getPaymentByLoanId(
    @Req() user: RequestUserDTO,
    @Param() loan_id: string,
  ) {
    try {
      const payments = await this.loanService.getPaymentsByLoanId(
        loan_id,
        user,
      );
      if (payments.data.error) {
        throw new Error(payments.data.error);
      }
      return payments;
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }
}
