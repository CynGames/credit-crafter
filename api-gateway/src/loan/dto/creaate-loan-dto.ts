import { IsString, IsNumber, IsInt, IsDate } from 'class-validator'

export class CreateLoanDTO{
    @IsString()
    user_id: string;

    @IsNumber()
    amount: number;

    @IsInt()
    installments: number;

    @IsDate()
    next_installment_date: Date;

    @IsDate()
    end_date: Date;

    @IsString()
    loan_type: String;
    
}   