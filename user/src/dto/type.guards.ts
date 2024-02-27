import {
  EmptyMessage,
  HealthMessageRequest,
  HealthMessageResponse,
  SpecificMessage,
} from './generic.dto';

export function isHealthMessageResponse(
  message: SpecificMessage,
): message is HealthMessageResponse {
  return message.headers.type === 'CreateHealthResponse';
}

export function isHealthMessageRequest(
  message: SpecificMessage,
): message is HealthMessageRequest {
  return message.headers.type === 'CreateHealthRequest';
}

export function isEmptyMessage(
  message: SpecificMessage,
): message is EmptyMessage {
  return message.headers.type === 'EmptyMessage';
}

export function payloadTypeExtractor(
  message: SpecificMessage,
): SpecificMessage {
  if (isHealthMessageResponse(message)) return message;
  if (isHealthMessageRequest(message)) return message;
  if (isEmptyMessage(message)) return message;

  throw new Error(`Unknown message type: ${message}`);
}
