export class FinancialDataDTO {
  id: string;
  creditScore: number;
  income: number;
  expenses: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string | null,
    creditScore: number,
    income: number,
    expenses: number,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.creditScore = creditScore;
    this.income = income;
    this.expenses = expenses;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
