export type GenericMessage<T> = {
  headers: {
    topic: string;
    type: MessageType;
    correlationId: string;
    offset?: string;
    userRecord: UserRecord;
  };
  payload: T;
};
export type ServerStatusPayload = {
  data: ServerStatus[];
};
export type ServerStatus = {
  service: string;
  status: string;
};
export type UserRecord = {
  uid: string;
  email?: string;
  // emailVerified: boolean;
  // displayName?: string;
  // photoURL?: string;
  // phoneNumber?: string;
  disabled: boolean;
  metadata: UserMetadata;
  providerData: UserInfo[];
  // passwordHash?: string;
  // passwordSalt?: string;
  // customClaims?: { [key: string]: any; };
  // tenantId?: string | null;
  // tokensValidAfterTime?: string;
  // multiFactor?: MultiFactorSettings;
}
export type LoanRecord = {
  uid: string;
  user_id: string;
  approved_by: string;
  amount: number;
  installment: number;
  next_installment_date: Date;
  end_date: Date;
  loan_type: string;
  created_at: Date;
  updated_at: Date;
}
export type UserMetadata = {
  creationTime: string;
  lastSignInTime: string;
  lastRefreshTime?: string | null;
}
export type UserInfo = {
  readonly uid: string;
  readonly displayName: string;
  readonly email: string;
  readonly photoURL: string;
  readonly providerId: string;
  readonly phoneNumber: string;
}
export type EmailUserPayload = {
  data: { email: string }
}
export type IdUserPayload = {
  data: { id: string }
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

export const RESPONSE_TO_API_GATEWAY = 'response-to-api-gateway'
export const HEALTH_REQUEST = 'health-request'
export const HEALTH_RESPONSE = 'health-response'
export const USER_CREATE_REQUEST = 'user-create-request'
export const USER_CREATE_RESPONSE = 'user-create-response'
export const USER_FETCH_REQUEST = 'user-fetch-request'
export const USER_FETCH_RESPONSE = 'user-fetch-response'
export const LOAN_CREATE_REQUEST = 'loan-create-request'
export const LOAN_CREATE_RESPONSE = 'loan-create-response'
export const LOAN_FETCH_RESPONSE = 'loan-fetch-response'
export const LOAN_FETCH_REQUEST = 'loan-fetch-response'
export const PAYMENT_CREATE_RESPONSE ='payment-create-response'


export type MessageType =
  | 'EmptyMessage'
  | 'CreateHealthRequest'
  | 'CreateHealthResponse'
  | 'CreateUserRequest'
  | 'CreateUserResponse'
  | 'FetchEmailUser'
  | 'FetchIdUser'
  | 'CreateLoanRequest'
  | 'CreateLoanResponse'
  | 'FetchIdLoan'
  | 'FetchUserIdLoan'
  | 'FetchLoanIdPayments'
  | 'CreatePaymentRequest'
  | 'CreatePaymentResponse';
export type EmptyMessage = GenericMessage<void> & {
  headers: { type: 'EmptyMessage' };
};
export type SpecificMessage =
  | EmptyMessage
  | HealthMessageRequest
  | HealthMessageResponse
  | CreateUserRequest
  | CreateUserResponse
  | FetchEmailUser
  | FetchIdUser;
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
export type FetchEmailUser = GenericMessage<void> & {
  headers: { type: 'FetchEmailUser' };
}
export type FetchIdUser = GenericMessage<void> & {
  headers: { type: 'FetchIdUser' };
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