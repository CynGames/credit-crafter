import { Injectable } from '@nestjs/common';
import { ProducerService } from '../kafka/producer.service';
import { LoanConsumer } from './loan.consumer';
import { auth } from 'firebase-admin';
import { CreateLoanDTO } from './dto/creaate-loan-dto';
import {
  GenerateUniqueId,
  GenericMessage,
  LOAN_CREATE_REQUEST,
  LOAN_FETCH_REQUEST,
  RequestUserDTO,
} from '../shared-definitions/types-dto-constants';
import { LoanFetchPayload } from './loan.controller';

@Injectable()
export class LoanService {
  constructor(
    private readonly producerService: ProducerService,
    private readonly loanConsumer: LoanConsumer,
  ) {}

  async createLoan(loan: CreateLoanDTO, { user }: RequestUserDTO) {
    loan.user_id = user.id;
    const correlationId = GenerateUniqueId();

    const message: GenericMessage<CreateLoanDTO> = {
      headers: {
        type: 'CreateLoanRequest',
        topic: LOAN_CREATE_REQUEST,
        correlationId: correlationId,
        userRecord: user,
      },
      payload: loan,
    };

    await this.producerService.sendMessage(message);
    const waitResponse =
      await this.loanConsumer.waitForCreateResponse(correlationId);
    console.log('[API-GATEWAY][SERVICE]response: ' + waitResponse);
    return waitResponse;
  }
  async getLoanByUserId(
    user_id: string,
    { user }: RequestUserDTO,
  ): Promise<LoanFetchPayload> {
    const correlationId = GenerateUniqueId();

    const message: GenericMessage<string> = {
      headers: {
        type: 'FetchUserIdLoan',
        topic: LOAN_FETCH_REQUEST,
        correlationId: correlationId,
        userRecord: user,
      },
      payload: user_id,
    };
    await this.producerService.sendMessage(message);
    const waitResponse: any =
      await this.loanConsumer.waitForFetchResponse(correlationId);
    console.log(waitResponse);

    return waitResponse;
  }
}
