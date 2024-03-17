import { GenericMessage, ServerStatus } from './dto-types';

export type MessageType =
  | 'EmptyMessage'
  | 'CreateHealthRequest'
  | 'CreateHealthResponse'
  | 'CreateUserRequest'
  | 'CreateUserResponse'
  | 'FetchUsers'
  | 'FetchEmailUser'
  | 'FetchIdUser'
  | 'CreateFinancialDataRequest'
  | 'CreateFinancialDataResponse'
  | 'FetchFinancialDataResponse'
  | 'FetchFinancialDataRequest';

export type SpecificMessage =
  | EmptyMessage
  | HealthMessageRequest
  | HealthMessageResponse
  | CreateUserRequest
  | CreateUserResponse
  | FetchUsers
  | FetchEmailUser
  | FetchIdUser
  | CreateFinancialDataRequest
  | CreateFinancialDataResponse
  | FetchFinancialDataResponse
  | FetchFinancialDataRequest;

export type FetchFinancialDataResponse = GenericMessage<void> & {
  headers: { type: 'FetchFinancialDataResponse' };
}

export type FetchFinancialDataRequest = GenericMessage<void> & {
  headers: { type: 'FetchFinancialDataRequest' };
}

export type CreateFinancialDataRequest = GenericMessage<void> & {
  headers: { type: 'CreateFinancialDataRequest' };
}

export type CreateFinancialDataResponse = GenericMessage<void> & {
  headers: { type: 'CreateFinancialDataResponse' };
}

export type FetchUsers = GenericMessage<void> & {
  headers: { type: 'FetchUsers' };
}

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