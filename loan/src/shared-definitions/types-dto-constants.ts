export type GenericMessage<T> = {
  headers: {
    topic: string;
    type: MessageTypes;
    correlationId: string;
    offset?: string;
    userRecord: UserDTO | null;
  };
  payload: T;
};
export type ServerStatus = {
  service: string;
  status: string;
};
export type CreateUserDTO = {
  success: string;
  data: {
    user: UserDTO;
  };
};
export type UserDTO = {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  roles?: string[]
}
export type LoanInfo = {
  readonly uid: string;
  readonly userId: string;
  readonly approvedBy: string;
  readonly amount: number;
  readonly installment: number;
  readonly nextInstallmentDate: Date;
  readonly end_date: Date;
  readonly loan_type: string;
}
export type IdLoanPayload = {
  data: { id: string }
}
export type UserIdLoanPayload = {
  data: { id: string }
}
export type LoanIdPaymentsPayload = {
  data: { id: string }
}
export type LoanUpdateRequest = {
  loanId: string;
  state: string;
}
export type LoanUpdateResponse = {
  loanId?: string,
  state?: string,
  error?: string
}
export type LoanUpdatePayload = {
  status: string,
  data: LoanUpdateResponse,
}
export type LoanFetchPayload = {
  status: string
  data: {
    loans?: any[],
    error?: string
  }
};
export type PaymentCreatePayload = {
  status: string,
  data: {
    paymentId?: string,
    error?: string
  }
}
export type PaymentCreateRequest = {
  loan_id: string,
  amount_paid: number
}
export type PaymentFetchRequest = {
  loan_id: string
}
export type PaymentFetchPayload = {
  status: string,
  data: {
    payments?: any[],
    error?: string
  }
}
export type LoanCreatePayload = {
  status: string,
  data: {
    loan_id?: string,
    error?: string
  }

}
export const HEALTH_REQUEST = 'health-request';
export const HEALTH_RESPONSE = 'health-response';
export const LOAN_CREATE_REQUEST = 'loan-create-request'
export const LOAN_CREATE_RESPONSE = 'loan-create-response'
export const LOAN_FETCH_RESPONSE = 'loan-fetch-response'
export const LOAN_FETCH_REQUEST = 'loan-fetch-request'
export const PAYMENT_CREATE_RESPONSE ='payment-create-response'
export const LOAN_UPDATE_REQUEST = 'loan-update-request'
export const LOAN_UPDATE_RESPONSE = 'loan-update-response'
export const PAYMENT_CREATE_REQUEST = 'payment-create-request'
export const PAYMENT_FETCH_REQUEST = 'payment-fetch-request'
export const PAYMENT_FETCH_RESPONSE = 'payment-fetch-response'
export type MessageTypes =
  | HeathMessageType
  | UserMessageType
  | FinancialMessageType
  | LoanMessageType;
export type HeathMessageType =
  | 'HealthMessageRequest'
  | 'HealthMessageResponse';
export type UserMessageType =
  | 'CreateUserRequest'
  | 'CreateUserResponse'
  | 'FetchUsers'
  | 'FetchEmailUser'
  | 'FetchIdUser';
export type FinancialMessageType =
  | 'CreateFinancialDataRequest'
  | 'CreateFinancialDataResponse'
  | 'FetchFinancialDataResponse'
  | 'FetchFinancialDataRequest';
export type LoanMessageType =
  | 'CreateLoanRequest'
  | 'CreateLoanResponse'
  | 'FetchIdLoan'
  | 'FetchUserIdLoan'
  | 'FetchLoanIdPayments'
  | 'CreatePaymentRequest'
  | 'CreatePaymentResponse'
  | 'UpdateLoanRequest'
  | 'UpdateLoanResponse';
export function GenerateUniqueId() {
  return 'unique-id-' + Math.random().toString(16).substr(4, 10);
}
