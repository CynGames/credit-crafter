import {
  Controller,
  Post,
  Req,
  UseGuards,
  Get,
  Body,
  Param,
  Put,
  HttpStatus,
  Res
} from '@nestjs/common';
import { LoanService } from './loan.service';
import { CreateLoanDTO } from 'src/loan/dto/creaate-loan-dto';
import { FirebaseAuthGuard } from '../auth/guards/auth.guard';
import { RequestUserDTO } from '../shared-definitions/types-dto-constants';
import { Response } from 'express';

@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post('/create')
  @UseGuards(FirebaseAuthGuard)
  async create(@Req() user: RequestUserDTO, @Body() loan: CreateLoanDTO, @Res() res: Response) {
    try {
      const result = await this.loanService.createLoan(loan, user);
      if (result.data.error) {
        throw new Error(result.data.error.toString());
      }
      res.status(HttpStatus.CREATED).send(result)
    } catch (error) {
      if (error.message.includes('Error creating loan: invalid')){
      res.status(HttpStatus.BAD_REQUEST).send({
        status: 'Error',
        message: error.message,
      })
    }else{
      res.status(HttpStatus.I_AM_A_TEAPOT).send({
        status: 'Error',
        message: error.message,
      })
    }
    }
  }
  @Get('user/:userId')
  @UseGuards(FirebaseAuthGuard)
  async getLoanByUserId(@Req() user: RequestUserDTO, @Param() userId: string, @Res() res: Response) {
    try {
      const result: any = await this.loanService.getLoanByUserId(
        userId,
        user,
      );
      if (result.data.error) {
        throw new Error(result.data.error.toString());
      }
      res.status(HttpStatus.FOUND).send(result)
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).send({
        status: 'Error',
        message: error.message,
      });
    }
  }
  @Put('/changeState')
  @UseGuards(FirebaseAuthGuard)
  async updateState(
    @Req() user: RequestUserDTO,
    @Body() body: { loan_id: string; state: string },
    @Res() res: Response
  ) {
    try {
      const result = await this.loanService.updateLoanState(
        body.loan_id,
        body.state,
        user,
      );
      if (result.status != 'success') {
        if (result.data.error) {
          throw new Error(result.data.error);
        } else {
          throw new Error('unsuccessful update');
        }
      }
      res.status(HttpStatus.OK).send(result)
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send({
        message: `Error Updating: ${error.message}`,
      })
    }
  }
  @Post('/payment/create')
  @UseGuards(FirebaseAuthGuard)
  async createPayment(
    @Req() user: RequestUserDTO,
    @Body() body: { loan_id: string; amount_paid: number },
    @Res() res: Response
  ) {
    try {
      const result = await this.loanService.createPayment(
        body.loan_id,
        body.amount_paid,
        user,
      );
      if (result.data.error) {
        throw new Error(result.data.error);
      }
      res.status(HttpStatus.CREATED).send(result);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send({
        message: error.message,
      })
    }
  }
  @Get('/payment/:loan_id')
  @UseGuards(FirebaseAuthGuard)
  async getPaymentByLoanId(
    @Req() user: RequestUserDTO,
    @Param() loan_id: string,
    @Res() res: Response
  ) {
    try {
      const payments = await this.loanService.getPaymentsByLoanId(
        loan_id,
        user,
      );
      if (payments.data.error) {
        throw new Error(payments.data.error);
      }
      res.status(HttpStatus.FOUND).send(payments);
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).send({
        message: error.message,
      })
    }
  }
}
