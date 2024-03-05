export type GenericMessage<T> = {
  headers: {
    topic: string;
    type: MessageType;
    correlationId: string;
    offset?: string;
  };
  payload: T;
};
export type ServerStatus = {
  service: string;
  status: string;
};
export const HEALTH_REQUEST = 'health-request'
export const HEALTH_RESPONSE = 'health-response'
export type MessageType =
  | 'EmptyMessage'
  | 'CreateHealthRequest'
  | 'CreateHealthResponse';
export type EmptyMessage = GenericMessage<void> & {
  headers: { type: 'EmptyMessage' };
};
export type SpecificMessage =
  | EmptyMessage
  | HealthMessageRequest
  | HealthMessageResponse;
export type HealthMessageRequest = GenericMessage<void> & {
  headers: { type: 'CreateHealthRequest' };
};
export type HealthMessageResponse = GenericMessage<ServerStatus> & {
  headers: { type: 'CreateHealthResponse' };
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
