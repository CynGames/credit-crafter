import { Injectable } from '@nestjs/common';
import { ProducerService } from '../kafka/producer.service';
import {
  EmailUserPayload,
  GenerateUniqueId,
  GenericMessage,
  IdUserPayload,
  USER_CREATE_REQUEST,
  USER_FETCH_REQUEST,
  UserRecord,
} from '../shared-definitions/types-dto-constants';
import {
  UserCreatePayload,
  UserCreateResponseDto,
  UserFetchPayload,
  UserFetchResponseDto,
} from './user.controller';
import { UserConsumer } from './user.consumer';

@Injectable()
export class UserService {
  constructor(
    private readonly producerService: ProducerService,
    private readonly userConsumer: UserConsumer,
  ) {}

  async createUser(user: UserRecord): Promise<UserCreatePayload> {
    const correlationId = GenerateUniqueId();

    const message: GenericMessage<void> = {
      headers: {
        type: 'CreateUserRequest',
        topic: USER_CREATE_REQUEST,
        correlationId: correlationId,
        userRecord: user,
      },
      payload: null,
    };

    await this.producerService.sendMessage(message);

    const response = this.userConsumer.createUserHandler(correlationId);

    return await this.userConsumer.waitForCreateResponse(
      correlationId,
      response,
    );
  }

  async fetchUserById(user: UserRecord, id: string): Promise<UserFetchPayload> {
    const correlationId = GenerateUniqueId();

    const message: GenericMessage<IdUserPayload> = {
      headers: {
        type: 'FetchIdUser',
        topic: USER_FETCH_REQUEST,
        correlationId: correlationId,
        userRecord: user,
      },
      payload: {
        data: { id: id },
      },
    };

    await this.producerService.sendMessage(message);

    const response = this.userConsumer.fetchUserHandler(correlationId);

    return await this.userConsumer.waitForFetchResponse(
      correlationId,
      response,
    );
  }

  async fetchUserByEmail(
    user: UserRecord,
    email: string,
  ): Promise<UserFetchPayload> {
    const correlationId = GenerateUniqueId();

    const message: GenericMessage<EmailUserPayload> = {
      headers: {
        type: 'FetchEmailUser',
        topic: USER_FETCH_REQUEST,
        correlationId: correlationId,
        userRecord: user,
      },
      payload: {
        data: { email: email },
      },
    };

    await this.producerService.sendMessage(message);

    const response = this.userConsumer.fetchUserHandler(correlationId);

    return await this.userConsumer.waitForFetchResponse(
      correlationId,
      response,
    );
  }
}
