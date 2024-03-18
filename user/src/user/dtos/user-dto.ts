export class UserDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  financialData?: {
    creditScore?: number;
    income?: number;
    expenses?: number;
  };

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    createdAt: Date,
    updatedAt: Date,
    financialData?: {
      creditScore?: number;
      income?: number;
      expenses?: number;
    },
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.financialData = financialData;
  }
}