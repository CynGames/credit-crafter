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
type UserMetadata = {
  creationTime: string;
  lastSignInTime: string;
  lastRefreshTime?: string | null;
}
type UserInfo = {
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
export type UserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}
export type FinancialDTO = {
  id: string;
  income: string;
  expenses: string;
}
export const HEALTH_REQUEST = 'health-request'
export const HEALTH_RESPONSE = 'health-response'
export const USER_CREATE_REQUEST = 'user-create-request'
export const USER_CREATE_RESPONSE = 'user-create-response'
export const USER_FETCH_REQUEST = 'user-fetch-request'
export const USER_FETCH_RESPONSE = 'user-fetch-response'
export type MessageType =
  | 'EmptyMessage'
  | 'CreateHealthRequest'
  | 'CreateHealthResponse'
  | 'CreateUserRequest'
  | 'CreateUserResponse'
  | 'FetchEmailUser'
  | 'FetchIdUser';
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
