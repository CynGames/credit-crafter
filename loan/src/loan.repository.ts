import { Injectable, NotFoundException } from "@nestjs/common";
import { pool } from "./db/db-conection";
import { LoanDTO } from "./dto/loan-dto";
import { PaymentDTO } from "./dto/payment-dto";
import { CreatePaymentDTO } from "./dto/create-payment-dto";
import { CreateLoanDTO } from "./dto/creaate-loan-dto";

@Injectable()
export class LoanRepository{
    async getLoans(): Promise<LoanDTO[]>{
        const queryText = 'select * from loan l'
        try{
            const result = await pool.query(queryText);

            const loans: LoanDTO[] = result.rows.map((row)=> new LoanDTO(
                row.loan_id,
                row.user_id,
                row.approved_by,
                row.amount,
                row.installment,
                row.next_installment_date,
                row.end_date,
                row.loan_type,
                row.created_at,
                row.updated_at));
            return loans;
        }catch(error){
            throw new Error(`error getting loans: ${error.message}`);
        }
   
    }
    // async getLoanByUser(user_id: string): Promise<LoanDTO[]>{
    //     const queryText = 'select * from loan'
    // }
    async create(newLoan: CreateLoanDTO): Promise<string>{
        const queryText = 'insert into loan(user_id, approved_by, \
            amount, installment, next_installment_date, end_date, \
            loan_type, created_at, updated_at) \
            values ($1, $2, $4, $5, $6) returning loan_id'
        const values = [
            newLoan.user_id,
            newLoan.approved_by,
            newLoan.amount,
            newLoan.installments,
            newLoan.next_installment_date,
            newLoan.end_date,
            newLoan.loan_type,
        ]
        try{
            const result = await pool.query(queryText, values);
            return result.rows[0].user_id;
        }catch(error){
            throw new Error(`Error creating loan: ${error.message}`);
        }
    }
    async getLoanById(loanId:string): Promise<LoanDTO>{
        const queryText = 'select * from loan where loan_id = $1'
        try{
            const result = await pool.query(queryText, [loanId]);
            if(result.rows === null){
                throw new NotFoundException('no user with that id');
            }
            const row = result.row[0];

            const loan = new LoanDTO(row.loan_id, row.user_id, row.approved_by, row.amount, row.installment, row.next_installment_date,
                row.end_date, row.loan_type, row.created_at, row.updated_at);
            return loan;
        }catch(error){ 
            throw new Error(`Error getting loan: ${error.message}`)
        }
    }
    async createPayment(payment: CreatePaymentDTO): Promise<string>{
        const queryText = 'insert into payment(loan_id, amount_paid, due_date) \
        values ($1, $2, $3) returning payment_id'
        const values =[
            payment.loan_id,
            payment.amount_paid,
            payment.due_date
        ]
        try{
            const result = await pool.query(queryText, values);
            return result.rows[0].user_id;
        }catch(error){
            throw new Error(`Error creating payment: ${error.message}`);
        }
    }
    async getPaymentsByLoan(loan_id: string): Promise<PaymentDTO[]>{
        const queryText = 'select * from payment where loan_id = $1';
        try{
            const result = await pool.query(queryText, [loan_id]);
            if(result.rows === null){
                throw new NotFoundException('no payment with that loan_id');
            }
            const payments = result.rows.map((row)=> new PaymentDTO(row.payment_id, row.loan_id,
                row.amount_paid, row.payment_date, row.created_at, row.updated_at));
            return payments;
        }catch(error){
            throw new Error(`error getting payments: ${error.message}`)
        }
    }
}
