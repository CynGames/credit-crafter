import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/user/dtos/create-user-dto';
import { UserRepository } from 'src/user/user.repository';
import { ProducerService } from '../kafka/producer.service';
import {
  GenericMessage,
  SpecificMessage,
  USER_FETCH_RESPONSE,
} from '../shared-definitions/types-dto-constants';
@Injectable()
export class UserService {
  constructor(
    private readonly repo: UserRepository,
    private readonly producerService: ProducerService,
  ) {}

  async create(requestMessage: SpecificMessage): Promise<any> {
    try {
      const { providerData, email } = requestMessage.headers.userRecord;
      // const {} = providerData;

      const { userRecord, correlationId } = requestMessage.headers;

      const user: CreateUserDTO = {
        user_id: userRecord.uid,
        email: userRecord.email,
        first_name: 'firstName',
        last_name: 'lastName',
        address: 'some address',
        phone_number: 'some phone',
      };

      const userId = await this.repo.create(user);

      const message: GenericMessage<any> = {
        headers: {
          type: 'CreateUserResponse',
          topic: USER_FETCH_RESPONSE,
          correlationId: correlationId,
          userRecord: userRecord,
        },
        payload: {
          data: { userId: userId },
        },
      };

      return await this.producerService.sendMessage(message);

      // return userId;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOneById(id: string) {
    try {
      const user = await this.repo.getById(id);
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.repo.getByEmail(email);
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
