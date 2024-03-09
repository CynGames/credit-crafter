import { MessageType } from './message-types';

export type GenericMessage<T> = {
  headers: {
    topic: string;
    type: MessageType;
    correlationId: string;
    offset?: string;
  };
  payload: T;
};

export type ServerStatusPayload = {
  data: ServerStatus[];
};

export type ServerStatus = {
  service: string;
  status: string;
};

export type UserDto = {
  name: string
}