import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { ProducerService } from '../kafka/producer.service';
import {
  GenericMessage,
  USER_CREATE_RESPONSE,
  USER_FETCH_RESPONSE,
} from '../shared-definitions/types-dto-constants';
import { CreateUserDTO } from './dtos/create-user-dto';
import { CreateFinancialDataDTO } from './dtos/create-financial-data-dto';
@Injectable()
export class UserService {
  constructor(
    private readonly repo: UserRepository,
    private readonly producerService: ProducerService,
  ) {}

  async findAllUsers(requestMessage: GenericMessage<any>) {
    try {
      const { userRecord, correlationId } = requestMessage.headers;
      const users = await this.repo.getUsers();

      const message: GenericMessage<any> = {
        headers: {
          type: 'FetchUsers',
          topic: USER_FETCH_RESPONSE,
          correlationId: correlationId,
          userRecord: userRecord,
        },
        payload: {
          data: users,
        },
      };

      return await this.producerService.sendMessage(message);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createUser(requestMessage: GenericMessage<any>): Promise<any> {
    try {
      const { userRecord, correlationId } = requestMessage.headers;

      const user: CreateUserDTO = {
        user_id: userRecord.id,
        email: userRecord.email,
        first_name: userRecord.firstName,
        last_name: userRecord.lastName,
      };

      await this.repo.create(user);

      const message: GenericMessage<any> = {
        headers: {
          type: 'CreateUserResponse',
          topic: USER_CREATE_RESPONSE,
          correlationId: correlationId,
          userRecord: userRecord,
        },
        payload: {
          data: { status: 'success' },
        },
      };

      return await this.producerService.sendMessage(message);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOneById(requestMessage: GenericMessage<any>) {
    try {
      const { userRecord, correlationId } = requestMessage.headers;
      const { data } = requestMessage.payload;

      const user = [await this.repo.getById(data.id)];

      const message: GenericMessage<any> = {
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

  async findOneByEmail(requestMessage: GenericMessage<any>) {
    try {
      const { userRecord, correlationId } = requestMessage.headers;
      const { data } = requestMessage.payload;

      const user = [await this.repo.getByEmail(data.email)];

      const message: GenericMessage<any> = {
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
        payload: {
          data: { status: 'success' },
        },
      };

      return await this.producerService.sendMessage(message);
    } catch (error) {
      throw new Error(`Error creating financial data: ${error.message}`);
    }
  }

  async fetchFinancialData(requestMessage: GenericMessage<any>) {
    try {
      const { userRecord, correlationId } = requestMessage.headers;
      const { id } = userRecord;

      const financialData = await this.repo.getFinancialDataById(id);

      const message: GenericMessage<any> = {
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
