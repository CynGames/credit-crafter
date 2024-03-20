import { IsNumber, isNumber, IsString } from "class-validator";

export class CreatePaymentDTO{
    @IsString()
    loan_id: string;

    @IsNumber()
    amount_paid: number

}