export type GenericMessage<T> = {
  headers: {
    topic: string;
    type: MessageTypes;
    correlationId: string;
    offset?: string;
    userRecord: UserDTO | null;
  };
  payload: T;
};
export type ServerStatus = {
  service: string;
  status: string;
};
export type UserDTO = {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  roles?: string[]
}
export class UserResponseDTO {
  status: string | undefined;
  data: UserPayload | UserPayload[] | undefined;
}
export type FinancialDTO = {
  id?: string;
  income: string;
  expenses: string;
}
export type UserPayload = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
  financialData?: FinancialData;
};
export type FinancialData = {
  creditScore?: number;
  income?: number;
  expenses?: number;
};
export type RequestUserDTO = {
  user: {
    id: string;
    email: string;
    roles?: string[];
  }
};
export const HEALTH_REQUEST = 'health-request';
export const HEALTH_RESPONSE = 'health-response';
export const USER_CREATE_REQUEST = 'user-create-request';
export const USER_CREATE_RESPONSE = 'user-create-response';
export const USER_FETCH_REQUEST = 'user-fetch-request';
export const USER_FETCH_RESPONSE = 'user-fetch-response';
export const FINANCIAL_DATA_CREATE_REQUEST = 'financial-data-create-request';
export const FINANCIAL_DATA_CREATE_RESPONSE = 'financial-data-create-response';
export const FINANCIAL_DATA_FETCH_REQUEST = 'financial-data-fetch-request';
export const FINANCIAL_DATA_FETCH_RESPONSE = 'financial-data-fetch-response';
export type MessageTypes =
  | HeathMessageType
  | UserMessageType
  | FinancialMessageType
  | LoanMessageType;
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
  | 'CreatePaymentResponse'
  | 'UpdateLoanRequest'
  | 'UpdateLoanResponse';
export function GenerateUniqueId() {
  return 'unique-id-' + Math.random().toString(16).substr(4, 10);
}
