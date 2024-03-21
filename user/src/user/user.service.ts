import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { ProducerService } from '../kafka/producer.service';
import {
  FinancialDTO,
  GenericMessage,
  USER_CREATE_RESPONSE,
  USER_FETCH_RESPONSE,
  UserDTO,
  UserPayload,
  UserResponseDTO,
} from '../shared-definitions/types-dto-constants';
import { CreateUserDTO } from './dtos/create-user-dto';
import { CreateFinancialDataDTO } from './dtos/create-financial-data-dto';
import { UserModel } from './dtos/user-model';
import { FinancialDataDTO } from './dtos/financial-data-dto';
@Injectable()
export class UserService {
  constructor(
    private readonly repo: UserRepository,
    private readonly producerService: ProducerService,
  ) {}

  async findAllUsers(requestMessage: GenericMessage<UserResponseDTO>) {
    try {
      const { userRecord, correlationId } = requestMessage.headers;
      const users = await this.repo.getUsers();

      const message: GenericMessage<{ data: UserModel[] }> = {
        headers: {
          type: 'FetchUsers',
          topic: USER_FETCH_RESPONSE,
          correlationId: correlationId,
          userRecord: userRecord,
        },
        payload: { data: users },
      };

      return await this.producerService.sendMessage(message);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createUser(requestMessage: GenericMessage<UserDTO>): Promise<any> {
    try {
      const { correlationId } = requestMessage.headers;
      const { id, email, firstName, lastName, roles } = requestMessage.payload;

      const user: CreateUserDTO = {
        user_id: id,
        email: email,
        first_name: firstName,
        last_name: lastName,
        roles: roles ? roles : ['user'],
      };

      // delete user.email;
      await this.repo.create(user);

      const message: GenericMessage<{ data: CreateUserDTO }> = {
        headers: {
          type: 'CreateUserResponse',
          topic: USER_CREATE_RESPONSE,
          correlationId: correlationId,
          userRecord: null,
        },
        payload: { data: user },
      };

      return await this.producerService.sendMessage(message);
    } catch (error) {
      const { correlationId } = requestMessage.headers;

      const message: GenericMessage<{ data: any }> = {
        headers: {
          type: 'CreateUserResponse',
          topic: USER_CREATE_RESPONSE,
          correlationId: correlationId,
          userRecord: null,
        },
        payload: { data: error },
      };

      return await this.producerService.sendMessage(message);
    }
  }

  async findOneById(requestMessage: GenericMessage<UserResponseDTO>) {
    try {
      const { userRecord, correlationId } = requestMessage.headers;
      const { id } = requestMessage.payload as unknown as UserPayload;

      const user = [await this.repo.getById(id)];

      const message: GenericMessage<{ data: UserModel[] }> = {
        headers: {
          type: 'FetchIdUser',
          topic: USER_FETCH_RESPONSE,
          correlationId: correlationId,
          userRecord: userRecord,
        },
        payload: {
          data: user,
        },
      };

      return await this.producerService.sendMessage(message);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOneByEmail(requestMessage: GenericMessage<UserResponseDTO>) {
    try {
      const { userRecord, correlationId } = requestMessage.headers;
      const { email } = requestMessage.payload as unknown as UserPayload;

      const user = [await this.repo.getByEmail(email)];

      const message: GenericMessage<{ data: UserModel[] }> = {
        headers: {
          type: 'FetchEmailUser',
          topic: USER_FETCH_RESPONSE,
          correlationId: correlationId,
          userRecord: userRecord,
        },
        payload: {
          data: user,
        },
      };

      return await this.producerService.sendMessage(message);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createFinancialData(requestMessage: GenericMessage<any>): Promise<any> {
    try {
      const { userRecord, correlationId } = requestMessage.headers;
      const creditScore =
        requestMessage.payload.income - requestMessage.payload.expenses;

      const financialData: CreateFinancialDataDTO = {
        userId: userRecord.id,
        creditScore: creditScore,
        income: requestMessage.payload.income,
        expenses: requestMessage.payload.expenses,
      };

      console.log('financialData');
      console.log(financialData);

      await this.repo.createFinancialData(financialData);

      const message: GenericMessage<any> = {
        headers: {
          type: 'CreateFinancialDataResponse',
          topic: USER_CREATE_RESPONSE,
          correlationId: correlationId,
          userRecord: userRecord,
        },
        payload: { data: financialData },
      };

      return await this.producerService.sendMessage(message);
    } catch (error) {
      throw new Error(`Error creating financial data: ${error.message}`);
    }
  }

  async fetchFinancialData(requestMessage: GenericMessage<FinancialDTO>) {
    try {
      const { userRecord, correlationId } = requestMessage.headers;
      const { id } = userRecord;

      const financialData = await this.repo.getFinancialDataById(id);

      const message: GenericMessage<{ data: FinancialDataDTO }> = {
        headers: {
          type: 'FetchFinancialDataResponse',
          topic: USER_FETCH_RESPONSE,
          correlationId: correlationId,
          userRecord: userRecord,
        },
        payload: {
          data: financialData,
        },
      };

      return await this.producerService.sendMessage(message);
    } catch (error) {
      throw new Error(`Error fetching financial data: ${error.message}`);
    }
  }
}
