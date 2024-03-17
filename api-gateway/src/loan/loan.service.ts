import { Injectable } from '@nestjs/common';
import { ProducerService } from '../kafka/producer.service';
import {
    IdLoanPayload,
    UserIdLoanPayload,
    LoanIdPaymentsPayload,
    LOAN_CREATE_RESPONSE,
    LOAN_FETCH_REQUEST,
    LOAN_FETCH_RESPONSE,
    LoanRecord
} from '../shared-definitions/types-dto-constants'
import { LoanConsumer } from './loan.consumer';
import {
    LoanCreatePayload,
    LoanCreateResponseDto,
    LoanFetchPayload,
    LoanFetchResponseDto
} from './controller/loan.controller'

@Injectable()
export class LoanService {
    constructor(private readonly producerService: ProducerService,
        private readonly loanConsumer: LoanConsumer){}
    
    async createLoan(loan: LoanRecord){

    }
}