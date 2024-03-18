import { IsEmail, IsString } from 'class-validator';

export class CreateFinancialDataDto {
  @IsString()
  user_id: string;

  @IsString()
  creditScore: string;

  @IsString()
  income: string;

  @IsEmail()
  expenses: string;
}

export class CreateFinancialDataDTO {
  userId: string;
  creditScore: number;
  income: number;
  expenses: number;

  constructor(
    userId: string,
    creditScore: number,
    income: number,
    expenses: number,
  ) {
    this.userId = userId;
    this.creditScore = creditScore;
    this.income = income;
    this.expenses = expenses;
  }
}
