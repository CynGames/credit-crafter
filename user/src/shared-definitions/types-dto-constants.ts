export type GenericMessage<T> = {
  headers: {
    topic: string;
    type: MessageType;
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
}
export type EmailUserPayload = {
  data: { email: string }
}
export type IdUserPayload = {
  data: { id: string }
}
export type FinancialDTO = {
  id?: string;
  income: string;
  expenses: string;
}
export class UserResponseDTO {
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
export type MessageType =
  | 'EmptyMessage'
  | 'CreateHealthRequest'
  | 'CreateHealthResponse'
  | 'CreateUserRequest'
  | 'CreateUserResponse'
  | 'FetchUsers'
  | 'FetchEmailUser'
  | 'FetchIdUser'
  | 'CreateFinancialDataRequest'
  | 'CreateFinancialDataResponse'
  | 'FetchFinancialDataResponse'
  | 'FetchFinancialDataRequest'
  | 'CreateLoanRequest'
  | 'CreateLoanResponse'
  | 'FetchIdLoan'
  | 'FetchUserIdLoan'
  | 'FetchLoanIdPayments'
  | 'CreatePaymentRequest'
  | 'CreatePaymentResponse'
  | 'UpdateLoanRequest'
  | 'UpdateLoanResponse';
export type EmptyMessage = GenericMessage<void> & {
  headers: { type: 'EmptyMessage' };
};
export type SpecificMessage =
  | EmptyMessage
  | HealthMessageRequest
  | HealthMessageResponse
  | CreateUserRequest
  | CreateUserResponse
  | FetchUsers
  | FetchEmailUser
  | FetchIdUser
  | CreateFinancialDataRequest
  | CreateFinancialDataResponse
  | FetchFinancialDataResponse
  | FetchFinancialDataRequest
  | CreateLoanRequest
  | CreateLoanResponse
  | FetchIdLoan
  | FetchUserIdLoan
  | FetchLoanIdPayments
  | CreatePaymentRequest
  | CreatePaymentResponse;
export type HealthMessageRequest = GenericMessage<void> & {
  headers: { type: 'CreateHealthRequest' };
};
export type HealthMessageResponse = GenericMessage<ServerStatus> & {
  headers: { type: 'CreateHealthResponse' };
};
export type CreateUserRequest = GenericMessage<void> & {
  headers: { type: 'CreateUserRequest' };
}
export type CreateUserResponse = GenericMessage<void> & {
  headers: { type: 'CreateUserResponse' };
}
export type FetchUsers = GenericMessage<void> & {
  headers: { type: 'FetchUsers' };
}
export type FetchEmailUser = GenericMessage<void> & {
  headers: { type: 'FetchEmailUser' };
}
export type FetchIdUser = GenericMessage<void> & {
  headers: { type: 'FetchIdUser' };
}
export type CreateFinancialDataRequest = GenericMessage<void> & {
  headers: { type: 'CreateFinancialDataRequest' };
}
export type CreateFinancialDataResponse = GenericMessage<void> & {
  headers: { type: 'CreateFinancialDataResponse' };
}
export type FetchFinancialDataResponse = GenericMessage<void> & {
  headers: { type: 'FetchFinancialDataResponse' };
}
export type FetchFinancialDataRequest = GenericMessage<void> & {
  headers: { type: 'FetchFinancialDataRequest' };
}
export type CreateLoanRequest = GenericMessage<void> & {
  headers: { type: 'CreateLoanRequest' };
}
export type CreateLoanResponse = GenericMessage<void> & {
  headers: { type: 'CreateLoanResponse' };
}
export type FetchIdLoan = GenericMessage<void> & {
  headers: { type: 'FetchIdLoan' };
}
export type FetchUserIdLoan = GenericMessage<void> & {
  headers: { type: 'FetchUserIdLoan' };
}
export type FetchLoanIdPayments = GenericMessage<void> & {
  headers: { type: 'FetchLoanIdPayments' };
}
export type CreatePaymentRequest = GenericMessage<void> & {
  headers: { type: 'CreatePaymentRequest' };
}
export type CreatePaymentResponse = GenericMessage<void> & {
  headers: { type: 'CreatePaymentResponse' };
}
export function IsEmptyMessage(
  message: SpecificMessage,
): message is EmptyMessage {
  return message.headers.type === 'EmptyMessage';
}
export function IsHealthMessageResponse(
  message: SpecificMessage,
): message is HealthMessageResponse {
  return message.headers.type === 'CreateHealthResponse';
}
export function IsHealthMessageRequest(
  message: SpecificMessage,
): message is HealthMessageRequest {
  return message.headers.type === 'CreateHealthRequest';
}
export function IsUserEmailFetchMessage(
  message: SpecificMessage,
): message is FetchEmailUser {
  return message.headers.type === 'FetchEmailUser';
}
export function IsUserIdFetchMessage(
  message: SpecificMessage,
): message is FetchIdUser {
  return message.headers.type === 'FetchIdUser';
}
export function PayloadTypeExtractor(
  message: SpecificMessage,
): SpecificMessage {
  if (IsHealthMessageResponse(message)) return message;
  if (IsHealthMessageRequest(message)) return message;
  if (IsEmptyMessage(message)) return message;
  
  throw new Error(`Unknown message type: ${message}`);
}
export function GenerateUniqueId() {
  return 'unique-id-' + Math.random().toString(16).substr(4, 10);
}
