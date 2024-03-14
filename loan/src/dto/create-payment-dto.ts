export class CreatePaymentDTO{
    loan_id: string;
    amount_paid: number;
    due_date: Date;

    constructor(loan_id:string, amount_paid: number, due_date: Date){
        this.loan_id = loan_id;
        this.amount_paid = amount_paid;
        this.due_date = due_date;
    }
}