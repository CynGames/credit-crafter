import { SpecificMessage } from './message-types';
import { IsEmptyMessage, IsHealthMessageRequest, IsHealthMessageResponse } from './type-guard-functions';

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

