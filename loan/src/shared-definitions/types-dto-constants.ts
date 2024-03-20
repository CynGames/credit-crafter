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
export type UserCreatePayload = {
  data: {
    success: boolean;
    user: UserDTO;
  };
};
export type UserDTO = {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
}
export type LoanInfo = {
  readonly uid: string;
  readonly userId: string;
  readonly approvedBy: string;
  readonly amount: number;
  readonly installment: number;
  readonly nextInstallmentDate: Date;
  readonly end_date: Date;
  readonly loan_type: string;
}
export type IdLoanPayload = {
  data: {id: string}
}
export type UserIdLoanPayload = {
  data: {id: string}
}
export type LoanIdPaymentsPayload = {
  data: {id: string}
}
export type LoanUpdateRequest = {
  loanId: string;
  state: string;
}
export type LoanUpdateResponse = {
  loanId?: string,
  state?: string,
  error?: string
}
export type LoanUpdatePayload = {
  status: string,
  data: LoanUpdateResponse,
}
export type LoanFetchPayload = {
  status: string
  data: {
    loans: any[]
  }
};
export type PaymentCreatePayload = {
  status: string,
  data: {
    paymentId?: string,
    error?: string
  }
}
export type PaymentCreateRequest = {
  loan_id: string,
  amount_paid: number
}
export type PaymentFetchRequest = {
  loan_id: string
}
export type PaymentFetchPayload = {
  status: string,
  data: {
    payments?: any[],
    error?: string
  }
}
export const HEALTH_REQUEST = 'health-request';
export const HEALTH_RESPONSE = 'health-response';
export const LOAN_CREATE_REQUEST = 'loan-create-request'
export const LOAN_CREATE_RESPONSE = 'loan-create-response'
export const LOAN_FETCH_RESPONSE = 'loan-fetch-response'
export const LOAN_FETCH_REQUEST = 'loan-fetch-request'
export const PAYMENT_CREATE_RESPONSE ='payment-create-response'
export const LOAN_UPDATE_REQUEST = 'loan-update-request'
export const LOAN_UPDATE_RESPONSE = 'loan-update-response'
export const PAYMENT_CREATE_REQUEST = 'payment-create-request'
export const PAYMENT_FETCH_REQUEST = 'payment-fetch-request'
export const PAYMENT_FETCH_RESPONSE = 'payment-fetch-response'
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
