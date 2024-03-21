export class UserModel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
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
    roles: string[],
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
    this.roles = roles;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.financialData = financialData;
  }
}
