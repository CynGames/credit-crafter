import { EmptyMessage, HealthMessageRequest, HealthMessageResponse, SpecificMessage } from './message-types';

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

export function IsEmptyMessage(
  message: SpecificMessage,
): message is EmptyMessage {
  return message.headers.type === 'EmptyMessage';
}
