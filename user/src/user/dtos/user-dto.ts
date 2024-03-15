export class UserDTO {
  _id: string | null;
  _first_name: string;
  _last_name: string;
  _address: string;
  _email: string;
  _phone_number: string;
  _created_at: Date;
  _updated_at: Date;
  _credit_score: number;
  _income: number;
  _expenses: number;

  constructor(
    id: string | null,
    firstName: string,
    lastName: string,
    address: string,
    email: string,
    phoneNumber: string,
    createdAt: Date,
    updatedAt: Date,
    creditScore: number,
    income: number,
    expenses: number,
  ) {
    this._id = id;
    this._first_name = firstName;
    this._last_name = lastName;
    this._address = address;
    this._email = email;
    this._phone_number = phoneNumber;
    this._created_at = createdAt;
    this._updated_at = updatedAt;
    this._credit_score = creditScore;
    this._income = income;
    this._expenses = expenses;
  }
}
