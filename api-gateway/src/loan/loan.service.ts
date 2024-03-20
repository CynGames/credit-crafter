import { Injectable } from '@nestjs/common';
import { ProducerService } from '../kafka/producer.service';
import { LoanConsumer } from './loan.consumer';
import { CreateLoanDTO } from './dto/creaate-loan-dto';
import {
  CreatePaymentRequest,
  FetchUserIdLoan,
  GenerateUniqueId,
  GenericMessage,
  LOAN_CREATE_REQUEST,
  LOAN_FETCH_REQUEST,
  LOAN_UPDATE_REQUEST,
  MessageType,
  PAYMENT_CREATE_REQUEST,
  PAYMENT_CREATE_RESPONSE,
  PAYMENT_FETCH_REQUEST,
  PAYMENT_FETCH_RESPONSE,
  PaymentCreatePayload,
  PaymentCreateRequest,
  PaymentFetchPayload,
  PaymentFetchRequest,
  RequestUserDTO,
  UserDTO,
  
} from '../shared-definitions/types-dto-constants';
import { LoanCreatePayload, LoanFetchPayload, LoanFetchRespond, LoanUpdatePayload, LoanUpdateRequest, LoanUpdateResponse } from './dto/payload-dtos';


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
    const waitResponse = await this.loanConsumer.genericWaitResponse<LoanCreatePayload>(correlationId);
  
    console.log(waitResponse);
    
    
    return waitResponse;
  }
  async genericSendMessageAndWaitForResponse<P,T>(
    type: MessageType,
    topic: string,
    userRecord: UserDTO,
    payload: P
  ): Promise<T>{
    const correlationId = GenerateUniqueId();
    const message: GenericMessage<P> = {
      headers: {
        type: type,
        topic: topic,
        correlationId: correlationId,
        userRecord: userRecord
      },
      payload: payload
    };
    await this.producerService.sendMessage(message);
    const pay = await this.loanConsumer.genericWaitResponse<T>(correlationId);
 
    return pay
    
  }
  async getLoanByUserId( user_id: string, { user }: RequestUserDTO): Promise<LoanFetchPayload> {

    const waitResponse = await this.genericSendMessageAndWaitForResponse<string, LoanFetchPayload>('FetchUserIdLoan', LOAN_FETCH_REQUEST, 
    user, user_id);

    return waitResponse;
  }
  async updateLoanState(loan_id: string, state: string, { user }): Promise<LoanUpdatePayload>{
        const correlationId = GenerateUniqueId();
        
        const message: GenericMessage<LoanUpdateRequest> = {
          headers: {
            type: 'UpdateLoanRequest',
            topic: LOAN_UPDATE_REQUEST,
            correlationId: correlationId,
            userRecord: user,
          },
          payload: {
            loanId: loan_id,
            state: state
          }
        };
        await this.producerService.sendMessage(message);
        const waitResponse: any =
        await this.loanConsumer.genericWaitResponse<LoanUpdatePayload>(correlationId);
        return waitResponse;
  }
  async createPayment(loan_id: string, amount_paid: number, { user }: RequestUserDTO){
    const waitResponse = await this.genericSendMessageAndWaitForResponse<PaymentCreateRequest, PaymentCreatePayload>(
      'CreatePaymentRequest', 
      PAYMENT_CREATE_REQUEST, 
      user, 
      {loan_id, amount_paid});
    return waitResponse;
  }
  async getPaymentsByLoanId(loan_id: string, { user }: RequestUserDTO): Promise<PaymentFetchPayload>{
   const payLoad: PaymentFetchRequest = {
      loan_id: loan_id
    }
    const waitResponse = await this.genericSendMessageAndWaitForResponse<PaymentFetchRequest, PaymentFetchPayload>(
      'FetchLoanIdPayments',
      PAYMENT_FETCH_REQUEST,
      user,
      payLoad
    )
      return waitResponse;
  }
}
