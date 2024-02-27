type MessageType =
  | 'EmptyMessage'
  | 'CreateHealthRequest'
  | 'CreateHealthResponse';

export type GenericMessage<T> = {
  headers: {
    topic: string;
    type: MessageType;
    correlationId: string;
    offset?: string;
  };
  payload: T;
};

export type HealthMessageResponse = GenericMessage<ServerStatus> & {
  headers: { type: 'CreateHealthResponse' };
};

export type HealthMessageRequest = GenericMessage<ServerStatus> & {
  headers: { type: 'CreateHealthRequest' };
};

export type EmptyMessage = GenericMessage<void> & {
  headers: { type: 'EmptyMessage' };
};

export type SpecificMessage =
  | EmptyMessage
  | HealthMessageRequest
  | HealthMessageResponse;

export type ServerStatusPayload = {
  data: ServerStatus[];
};

export type ServerStatus = {
  service: string;
  status: string;
};
