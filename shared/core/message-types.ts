import { GenericMessage, ServerStatus } from './dto-types';

export type MessageType =
  | 'EmptyMessage'
  | 'CreateHealthRequest'
  | 'CreateHealthResponse'
  | 'CreateUserRequest'
  | 'CreateUserResponse'
  | 'FetchEmailUser'
  | 'FetchIdUser';

export type SpecificMessage =
  | EmptyMessage
  | HealthMessageRequest
  | HealthMessageResponse
  | CreateUserRequest
  | CreateUserResponse
  | FetchEmailUser
  | FetchIdUser;

export type FetchEmailUser = GenericMessage<void> & {
  headers: { type: 'FetchEmailUser' };
}

export type FetchIdUser = GenericMessage<void> & {
  headers: { type: 'FetchIdUser' };
}

export type CreateUserRequest = GenericMessage<void> & {
  headers: { type: 'CreateUserRequest' };
}

export type CreateUserResponse = GenericMessage<void> & {
  headers: { type: 'CreateUserResponse' };
}

export type HealthMessageResponse = GenericMessage<ServerStatus> & {
  headers: { type: 'CreateHealthResponse' };
};

export type HealthMessageRequest = GenericMessage<void> & {
  headers: { type: 'CreateHealthRequest' };
};

export type EmptyMessage = GenericMessage<void> & {
  headers: { type: 'EmptyMessage' };
};