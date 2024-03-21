import { Injectable, NotFoundException } from '@nestjs/common';
import { pool } from '../db/db-conection';
import { LoanDTO } from './dtos/loan-dto';
import { PaymentDTO } from './dtos/payment-dto';
import { CreatePaymentDTO } from './dtos/create-payment-dto';
import { CreateLoanDTO } from './dtos/creaate-loan-dto';

@Injectable()
export class LoanRepository {
  async getLoans(user_id: string): Promise<LoanDTO[]> {
    const queryText = `
            SELECT 
                l.loan_id,
                l.user_id,
                l.approved_by,
                l.amount,
                l.installments,
                l.next_installment_date,
                l.end_date,
                l.loan_type,
                s.state_name,
                l.created_at,
                l.updated_at
            FROM 
                loan l
            JOIN 
                states s ON l.state_id = s.state_id
           `;

    try {
      const result = await pool.query(queryText, [user_id]);
      if (result.rows.length === 0) {
        throw new NotFoundException('No loans for that user ID');
      }

      const loans = result.rows.map(
        (row) =>
          new LoanDTO(
            row.loan_id,
            row.user_id,
            row.approved_by,
            row.amount,
            row.installments,
            row.next_installment_date,
            row.end_date,
            row.loan_type,
            row.state_name,
            row.created_at,
            row.updated_at,
          ),
      );

      return loans;
    } catch (error) {
      throw new Error(`Error getting loans: ${error.message}`);
    }
  }
  async create(newLoan: CreateLoanDTO): Promise<string> {
    const loanQuery =
      'insert into loan(user_id, \
            amount, installments, next_installment_date, end_date, \
            loan_type, state_id)  \
            values ($1, $2, $3, $4, $5, $6, $7) returning loan_id';
    const stateQuery = 'select state_id from states where state_name = $1';

    try {
      await pool.query('BEGIN');
      const defaultStatus = 'toReview';
      const stateResult = await pool.query(stateQuery, [defaultStatus]);
      const state_id = stateResult.rows[0].state_id;

      const values = [
        newLoan.user_id,
        newLoan.amount,
        newLoan.installments,
        newLoan.next_installment_date,
        newLoan.end_date,
        newLoan.loan_type,
        state_id,
      ];
      const loanResult = await pool.query(loanQuery, values);
      const loanId = loanResult.rows[0].loan_id;
      await pool.query('commit');
      return loanId;
    } catch (error) {
      await pool.query('rollback');
      throw new Error(`Error creating loan: ${error.message}`);
    }
  }
  async getLoanById(loanId: string): Promise<LoanDTO> {
    const loanQuery = 'select * from loan where loan_id = $1';
    const stateQuery = 'select state_name from states where state_id = $1';
    try {
      const result = await pool.query(loanQuery, [loanId]);
      if (result.rows === null) {
        throw new NotFoundException('no loan with that id');
      }
      const row = result.row[0];
      const stateResult = pool.query(stateQuery, [row.state_id]);
      const state = stateResult.rows[0].state_name;
      const loan = new LoanDTO(
        row.loan_id,
        row.user_id,
        row.approved_by,
        row.amount,
        row.installment,
        row.next_installment_date,
        row.end_date,
        row.loan_type,
        state,
        row.created_at,
        row.updated_at,
      );
      return loan;
    } catch (error) {
      throw new Error(`Error getting loan: ${error.message}`);
    }
  }
  async createPayment(payment: CreatePaymentDTO): Promise<string> {
    const queryText =
      'insert into payment(loan_id, amount_paid) \
        values ($1, $2) returning payment_id';
    const values = [payment.loan_id, payment.amount_paid];
    try {
      const result = await pool.query(queryText, values);
      return result.rows[0].payment_id;
    } catch (error) {
      throw new Error(`Error creating payment: ${error.message}`);
    }
  }
  async getPaymentsByLoan(loan_id: string): Promise<PaymentDTO[]> {
    const queryText = 'select * from payment where loan_id = $1';
    try {
      const result = await pool.query(queryText, [loan_id]);
      if (result.rows === null) {
        throw new NotFoundException('no payment with that loan_id');
      }
      const payments = result.rows.map(
        (row) =>
          new PaymentDTO(
            row.payment_id,
            row.loan_id,
            row.amount_paid,
            row.payment_date,
            row.created_at,
            row.updated_at,
          ),
      );
      return payments;
    } catch (error) {
      throw new Error(`error getting payments: ${error.message}`);
    }
  }
  async getLoansByUser(user_id: string): Promise<LoanDTO[]> {
    const queryText = `
            SELECT 
                l.loan_id,
                l.user_id,
                l.approved_by,
                l.amount,
                l.installments,
                l.next_installment_date,
                l.end_date,
                l.loan_type,
                s.state_name,
                l.created_at,
                l.updated_at
            FROM 
                loan l
            JOIN 
                states s ON l.state_id = s.state_id
            WHERE 
                l.user_id = $1`;

    try {
      const result = await pool.query(queryText, [user_id]);
      if (result.rows.length === 0) {
        throw new NotFoundException('No loans for that user ID');
      }

      const loans = result.rows.map(
        (row) =>
          new LoanDTO(
            row.loan_id,
            row.user_id,
            row.approved_by,
            row.amount,
            row.installments,
            row.next_installment_date,
            row.end_date,
            row.loan_type,
            row.state_name,
            row.created_at,
            row.updated_at,
          ),
      );

      return loans;
    } catch (error) {
      throw new Error(`Error getting loans: ${error.message}`);
    }
  }
  async updateLoanState(loan_id: string, state: string) {
    try {
      const stateQuery = 'SELECT state_id FROM states WHERE state_name = $1';
      const loanQuery = 'UPDATE loan SET state_id = $1 WHERE loan_id = $2';
      await pool.query('begin');
      const stateResult = await pool.query(stateQuery, [state]);
      if (stateResult.rows === null) {
        throw new NotFoundException(`state: ${state} does not exist`);
      }
      const state_id = stateResult.rows[0].state_id;
      await pool.query(loanQuery, [state_id, loan_id]);
      await pool.query('COMMIT');
    } catch (error) {
      await pool.query('ROLLBACK');
      console.error(
        'Error occurred while changing loan state: ' + error.message,
      );
      throw error;
    }
  }
}
