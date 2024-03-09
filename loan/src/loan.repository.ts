import { Injectable } from "@nestjs/common";
import { pool } from "./db/db-conection";
import { LoanDTO } from "./dto/loan-dto";

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
    async create(newLoan: LoanDTO): Promise<string>{
        const queryText = 'insert into loan(user_id, approved_by, \
            amount, installment, next_installment_date, end_date, \
            loan_type, created_at, updated_at) \
            values ($1, $2, $4, $5, $6) returning loan_id'
        const values = [
            newLoan._user_id,
            newLoan._approved_by,
            newLoan._amount,
            newLoan._installment,
            newLoan._next_installment_date,
            newLoan._end_date,
            newLoan._loan_type,
            newLoan._created_at,
            newLoan._updated_at
        ]
        try{
            const result = await pool.query(queryText, values);
            return result.rows[0].user_id;
        }catch(error){
            throw new Error(`Error creating user: ${error.message}`);
        }
    }
    async getLoanById(loanId:string): Promise<LoanDTO>{
        const queryText = 'select * from loan where loan_id = $1'
        try{
            const result = await pool.query(queryText, [loanId]);
            
        }
    }
}
