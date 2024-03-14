export class LoanDTO{
    _id: string | null;
    _user_id: string;
    _approved_by: string;
    _amount: number;
    _installment: number;
    _next_installment_date: Date;
    _end_date: Date;
    _loan_type: string;
    _created_at: Date;
    _updated_at: Date;

    constructor(
        id: string,
        user_id: string,
        approved_by:string,
        amount: number,
        installment:number,
        next_installment_date: Date,
        end_date: Date,
        loan_type: string,
        created_at: Date,
        updated_at: Date
    ){
        this._id = id;
        this._user_id = user_id;
        this._approved_by = approved_by;
        this._amount = amount;
        this._installment = installment;
        this._next_installment_date = next_installment_date;
        this._end_date = end_date;
        this._loan_type = loan_type;
        this._created_at = created_at;
        this._updated_at = updated_at;
    }
}