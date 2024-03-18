import { Injectable } from '@nestjs/common';
import { ProducerService } from '../kafka/producer.service';
import { UserConsumer } from './user.consumer';
import {
  EmailUserPayload,
  FINANCIAL_DATA_CREATE_REQUEST,
  FINANCIAL_DATA_FETCH_REQUEST,
  FinancialDTO,
  GenerateUniqueId,
  GenericMessage,
  IdUserPayload,
  USER_CREATE_REQUEST,
  USER_FETCH_REQUEST,
  UserDTO,
} from '../shared-definitions/types-dto-constants';
import {
  FetchUserDTO,
  FetchUsersDTO,
  FinancialData,
  RequestDTO,
} from './user.controller';

@Injectable()
export class UserService {
  constructor(
    private readonly producerService: ProducerService,
    private readonly userConsumer: UserConsumer,
  ) {}

  async fetchUsers(): Promise<RequestDTO> {
    const correlationId = GenerateUniqueId();

    const message: GenericMessage<any> = {
      headers: {
        type: 'FetchUsers',
        topic: USER_FETCH_REQUEST,
        correlationId: correlationId,
        userRecord: null,
      },
      payload: null,
    };

    await this.producerService.sendMessage(message);

    return await this.userConsumer.waitForFetchUserResponse(correlationId);
  }

  async createUser(user: UserDTO): Promise<boolean> {
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

    const output = this.userConsumer.createUserHandler(correlationId);

    return await this.userConsumer.waitForCreateUserResponse(
      correlationId,
      output,
    );
  }

  async fetchUserById(id: string): Promise<RequestDTO> {
    const correlationId = GenerateUniqueId();

    const message: GenericMessage<IdUserPayload> = {
      headers: {
        type: 'FetchIdUser',
        topic: USER_FETCH_REQUEST,
        correlationId: correlationId,
        userRecord: null,
      },
      payload: {
        data: { id: id },
      },
    };

    await this.producerService.sendMessage(message);

    // const response = this.userConsumer.fetchUserHandler(correlationId);

    return await this.userConsumer.waitForFetchUserResponse(
      correlationId,
      // response,
    );
  }

  async fetchUserByEmail(email: string): Promise<RequestDTO> {
    const correlationId = GenerateUniqueId();

    const message: GenericMessage<EmailUserPayload> = {
      headers: {
        type: 'FetchEmailUser',
        topic: USER_FETCH_REQUEST,
        correlationId: correlationId,
        userRecord: null,
      },
      payload: {
        data: { email: email },
      },
    };

    await this.producerService.sendMessage(message);

    // const response = this.userConsumer.fetchUserHandler(correlationId);

    return await this.userConsumer.waitForFetchUserResponse(
      correlationId,
      // response,
    );
  }

  async createFinancialData(user: UserDTO, body: any): Promise<any> {
    const correlationId = GenerateUniqueId();

    const message: GenericMessage<any> = {
      headers: {
        type: 'CreateFinancialDataRequest',
        topic: FINANCIAL_DATA_CREATE_REQUEST,
        correlationId: correlationId,
        userRecord: user,
      },
      payload: {
        income: body.income,
        expenses: body.expenses,
      },
    };

    await this.producerService.sendMessage(message);

    // const output =
    //   this.userConsumer.createUserFinancialDataHandler(correlationId);

    return await this.userConsumer.waitForCreateUserFinancialDataResponse(
      correlationId,
      // output,
    );
  }

  async fetchFinancialData(user: UserDTO): Promise<boolean> {
    const correlationId = GenerateUniqueId();

    const message: GenericMessage<void> = {
      headers: {
        type: 'FetchFinancialDataRequest',
        topic: FINANCIAL_DATA_FETCH_REQUEST,
        correlationId: correlationId,
        userRecord: user,
      },
      payload: null,
    };

    await this.producerService.sendMessage(message);

    // const output = this.userConsumer.createUserHandler(correlationId);

    return await this.userConsumer.waitForFetchUserFinancialDataResponse(
      correlationId,
      // output,
    );
  }
}
