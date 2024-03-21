import { Injectable } from '@nestjs/common';
import { ProducerService } from '../kafka/producer.service';
import { UserConsumer } from './user.consumer';
import { FetchFinancialDataDTO } from './dtos/fetch-financial-data-dto';
import { CreateFinancialDataDTO } from './dtos/create-financial-data-dto';
import { CreateUserDTO } from '../auth/dtos/register-user-dto';
import { UserResponseDTO, UsersResponseDTO } from './dtos/fetch-users.dto';
import {
  FINANCIAL_DATA_CREATE_REQUEST,
  FINANCIAL_DATA_FETCH_REQUEST,
  FinancialDTO,
  GenerateUniqueId,
  GenericMessage,
  MessageTypes,
  USER_CREATE_REQUEST,
  USER_FETCH_REQUEST,
  UserDTO,
} from '../shared-definitions/types-dto-constants';

@Injectable()
export class UserService {
  constructor(
    private readonly producerService: ProducerService,
    private readonly userConsumer: UserConsumer,
  ) {}

  async fetchUsers(): Promise<UsersResponseDTO> {
    return this.genericSendMessageAndWaitForResponse<void, UsersResponseDTO>(
      'FetchUsers',
      USER_FETCH_REQUEST,
      null,
      null,
    );
  }

  async createUser(user: UserDTO): Promise<CreateUserDTO> {
    return this.genericSendMessageAndWaitForResponse<UserDTO, CreateUserDTO>(
      'CreateUserRequest',
      USER_CREATE_REQUEST,
      null,
      { ...user },
    );
  }

  async fetchUserById(id: string): Promise<UserResponseDTO> {
    return this.genericSendMessageAndWaitForResponse<
      { id: string },
      UserResponseDTO
    >('FetchIdUser', USER_FETCH_REQUEST, null, { id: id });
  }

  async fetchUserByEmail(email: string): Promise<UserResponseDTO> {
    return this.genericSendMessageAndWaitForResponse<
      { email: string },
      UserResponseDTO
    >('FetchEmailUser', USER_FETCH_REQUEST, null, { email: email });
  }

  async createFinancialData(
    user: UserDTO,
    body: FinancialDTO,
  ): Promise<CreateFinancialDataDTO> {
    return this.genericSendMessageAndWaitForResponse<
      FinancialDTO,
      CreateFinancialDataDTO
    >('CreateFinancialDataRequest', FINANCIAL_DATA_CREATE_REQUEST, user, {
      income: body.income,
      expenses: body.expenses,
    });
  }

  async fetchFinancialData(user: UserDTO): Promise<FetchFinancialDataDTO> {
    return this.genericSendMessageAndWaitForResponse<
      void,
      FetchFinancialDataDTO
    >('FetchFinancialDataResponse', FINANCIAL_DATA_FETCH_REQUEST, user, null);
  }

  async genericSendMessageAndWaitForResponse<P, T>(
    type: MessageTypes,
    topic: string,
    userRecord: UserDTO,
    payload: P,
  ): Promise<T> {
    const correlationId = GenerateUniqueId();

    const message: GenericMessage<P> = {
      headers: {
        type: type,
        topic: topic,
        correlationId: correlationId,
        userRecord: userRecord,
      },
      payload: payload,
    };

    await this.producerService.sendMessage(message);

    return await this.userConsumer.genericWaitForResponse<T>(correlationId);
  }
}
