import { Injectable } from '@nestjs/common';
import { LoanRepository } from './loan.repository';
import { CreateLoanDTO } from './dtos/creaate-loan-dto';
import { CreatePaymentDTO } from './dtos/create-payment-dto';
import { PaymentDTO } from './dtos/payment-dto';
import { LoanDTO } from './dtos/loan-dto';

@Injectable()
export class LoanService {
  constructor(private repo: LoanRepository) {}

  async create(newLoan: CreateLoanDTO) {
    try {
      const loan_id = await this.repo.create(newLoan);
      return loan_id;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getLoanById(loanId: string) {
    try {
      const loan = await this.repo.getLoanById(loanId);
      return loan;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }
  async createPayment(newPayment: CreatePaymentDTO) {
    try {
      const paymentId = await this.repo.createPayment(newPayment);
      return paymentId;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }
  async getPaymentsByLoan(loan_id: string) {
    try {
      const payments: PaymentDTO[] = await this.repo.getPaymentsByLoan(loan_id);
      return payments;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }
  async getLoansByUser(user_id: string) {
    try {
      const loans: LoanDTO[] = await this.repo.getLoansByUser(user_id);
      return loans;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }
  async changLoanState(loan_id: string, state: string) {
    try {
      await this.repo.updateLoanState(loan_id, state);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
