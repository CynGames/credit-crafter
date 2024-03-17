import { Injectable } from '@nestjs/common';
import { ProducerService } from '../kafka/producer.service';
import {
    IdLoanPayload,
    UserIdLoanPayload,
    LoanIdPaymentsPayload,
    LOAN_CREATE_RESPONSE,
    LOAN_FETCH_REQUEST,
    LOAN_FETCH_RESPONSE,
    UserRecord,
    LOAN_CREATE_REQUEST
} from '../dto/types-dto-constants'
import { LoanConsumer } from './loan.consumer';
import {
    LoanCreatePayload,
    LoanCreateResponseDto,
    LoanFetchPayload,
    LoanFetchResponseDto
} from './controller/loan.controller'
import { GenerateUniqueId, GenericMessage } from 'src/dto/types-dto-constants';
import { CreateLoanDTO } from 'src/dto/creaate-loan-dto';

@Injectable()
export class LoanService {
    constructor(private readonly producerService: ProducerService,
        private readonly loanConsumer: LoanConsumer){}
    
    async createLoan(loan: CreateLoanDTO, user: UserRecord){
       
        loan.user_id = user.uid;
        const correlationId = GenerateUniqueId();
        
        const message: GenericMessage<CreateLoanDTO> = {
            headers: {
                type: 'CreateLoanRequest',
                topic: LOAN_CREATE_REQUEST ,
                correlationId: correlationId,
                userRecord: user
            }, 
            payload: loan,
        };

        await this.producerService.sendMessage(message);
        const waitResponse = await this.loanConsumer.waitForCreateResponse(
            correlationId,
        );
        console.log("[API-GATEWAY][SERVICE]response: "+ waitResponse);
        return waitResponse;
        
        }

}