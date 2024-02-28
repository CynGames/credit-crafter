import { GenericMessage, ServerStatus } from './dto-types';

export type MessageType =
  | 'EmptyMessage'
  | 'CreateHealthRequest'
  | 'CreateHealthResponse';

export type SpecificMessage =
  | EmptyMessage
  | HealthMessageRequest
  | HealthMessageResponse;

export type HealthMessageResponse = GenericMessage<ServerStatus> & {
  headers: { type: 'CreateHealthResponse' };
};

export type HealthMessageRequest = GenericMessage<void> & {
  headers: { type: 'CreateHealthRequest' };
};

export type EmptyMessage = GenericMessage<void> & {
  headers: { type: 'EmptyMessage' };
};