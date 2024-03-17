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
  creditScore: number;
  income: number;
  expenses: number;

  constructor(creditScore: number, income: number, expenses: number) {
    this.creditScore = creditScore;
    this.income = income;
    this.expenses = expenses;
  }
}
