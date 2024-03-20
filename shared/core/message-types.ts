import { GenericMessage } from './dto-types';

export type MessageTypes =
  | HeathMessageType
  | UserMessageType
  | FinancialMessageType
  | LoanMessageType;

// export type MessageType =
//   | 'EmptyMessage'
//   // | 'CreateUserRequest'
//   // | 'CreateUserResponse'
//   // | 'FetchUsers'
//   // | 'FetchEmailUser'
//   // | 'FetchIdUser'
//   | 'CreateFinancialDataRequest'
//   | 'CreateFinancialDataResponse'
//   | 'FetchFinancialDataResponse'
//   | 'FetchFinancialDataRequest'
//   | 'CreateLoanRequest'
//   | 'CreateLoanResponse'
//   | 'FetchIdLoan'
//   | 'FetchUserIdLoan'
//   | 'FetchLoanIdPayments'
//   | 'CreatePaymentRequest'
//   | 'CreatePaymentResponse';

export type HeathMessageType =
  | 'HealthMessageRequest'
  | 'HealthMessageResponse';

export type UserMessageType =
  | 'CreateUserRequest'
  | 'CreateUserResponse'
  | 'FetchUsers'
  | 'FetchEmailUser'
  | 'FetchIdUser';

export type FinancialMessageType =
  | 'CreateFinancialDataRequest'
  | 'CreateFinancialDataResponse'
  | 'FetchFinancialDataResponse'
  | 'FetchFinancialDataRequest';

export type LoanMessageType =
  | 'CreateLoanRequest'
  | 'CreateLoanResponse'
  | 'FetchIdLoan'
  | 'FetchUserIdLoan'
  | 'FetchLoanIdPayments'
  | 'CreatePaymentRequest'
  | 'CreatePaymentResponse';
