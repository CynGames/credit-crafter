import { Injectable } from "@nestjs/common";
import { LoanRepository } from "./loan.repository";
import { CreateLoanDTO } from "./dto/creaate-loan-dto";
import { CreatePaymentDTO } from "./dto/create-payment-dto";
import { PaymentDTO } from "./dto/payment-dto";


@Injectable()
export class LoanService{
    constructor(private repo: LoanRepository){}

    async create(loandto: CreateLoanDTO){
        try{
        const loan_id = await this.repo.create(loandto);
        return loan_id;
        }catch(error){
            throw new Error(`${error.message}`)
        }
    }
    async getLoanById(loanId: string){
        try{
            const loan = await this.repo.getLoanById(loanId);
            return loan;
        }catch(error){
            throw new Error(`${error.message}`);
        }
    }
    async createPayment(newPayment: CreatePaymentDTO){
        try{
            const paymentId = await this.repo.createPayment(newPayment);
            return paymentId;
        }catch(error){
            throw new Error(`${error.message}`)
        }
    }
    async getPaymentsByLoan(loan_id: string){
        try{
            const payments: PaymentDTO[] = await this.repo.getPaymentsByLoan(loan_id);
            return payments;
        }catch(error){
            throw new Error(`${error.message}`)
        }
    }
}