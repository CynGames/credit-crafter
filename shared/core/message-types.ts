import { GenericMessage, ServerStatus } from './dto-types';

export type MessageType =
  | 'EmptyMessage'
  | 'CreateHealthRequest'
  | 'CreateHealthResponse'
  | 'CreateAuthRequest'
  | 'CreateAuthResponse';

export type SpecificMessage =
  | EmptyMessage
  | HealthMessageRequest
  | HealthMessageResponse
  | AuthMessageRequest
  | AuthMessageResponse;

export type HealthMessageResponse = GenericMessage<ServerStatus> & {
  headers: { type: 'CreateHealthResponse' };
};

export type HealthMessageRequest = GenericMessage<void> & {
  headers: { type: 'CreateHealthRequest' };
};

export type AuthMessageResponse = GenericMessage<void> & {
  headers: { type: 'CreateAuthResponse' };
};

export type AuthMessageRequest = GenericMessage<void> & {
  headers: { type: 'CreateAuthRequest' };
};

export type EmptyMessage = GenericMessage<void> & {
  headers: { type: 'EmptyMessage' };
};