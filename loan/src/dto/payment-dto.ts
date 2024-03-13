export class PaymentDTO{
    _id: string;
    _loan_id: string;
    _amount_paid: number;
    _payment_date: Date;
    _created_at: Date;
    _updated_at: Date;

    constructor(id, loan_id, amount_paid, payment_date, created_at, updated_at){
        this._id = id;
        this._loan_id = loan_id;
        this._amount_paid = amount_paid;
        this._payment_date = payment_date;
        this._created_at = created_at;
        this._updated_at = updated_at;
    }
}