import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { ProducerService } from '../kafka/producer.service';
import {
  GenericMessage,
  SpecificMessage,
  USER_CREATE_RESPONSE,
  USER_FETCH_RESPONSE,
  UserDTO,
} from '../shared-definitions/types-dto-constants';
import { CreateUserDTO } from './dtos/create-user-dto';
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
}
