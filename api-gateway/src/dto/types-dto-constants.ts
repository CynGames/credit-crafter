export type GenericMessage<T> = {
  headers: {
    topic: string;
    type: MessageType;
    correlationId: string;
    offset?: string;
    userRecord: UserRecord
  };
  payload: T;
};
export type UserDto = {
  name: string
}
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
export const RESPONSE_TO_API_GATEWAY = 'response-to-api-gateway'
export const HEALTH_REQUEST = 'health-request'
export const HEALTH_RESPONSE = 'health-response'
export type MessageType =
  | 'EmptyMessage'
  | 'CreateHealthRequest'
  | 'CreateHealthResponse'
  | 'CreateAuthRequest'
  | 'CreateAuthResponse';
export type EmptyMessage = GenericMessage<void> & {
  headers: { type: 'EmptyMessage' };
};
export type SpecificMessage =
  | EmptyMessage
  | HealthMessageRequest
  | HealthMessageResponse
  | AuthMessageRequest
  | AuthMessageResponse;
export type HealthMessageRequest = GenericMessage<void> & {
  headers: { type: 'CreateHealthRequest' };
};
export type HealthMessageResponse = GenericMessage<ServerStatus> & {
  headers: { type: 'CreateHealthResponse' };
};
export type AuthMessageRequest = GenericMessage<void> & {
  headers: { type: 'CreateAuthRequest' };
};
export type AuthMessageResponse = GenericMessage<void> & {
  headers: { type: 'CreateAuthResponse' };
};
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
