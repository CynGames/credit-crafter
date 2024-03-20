import { MessageType } from './message-types';

export type GenericMessage<T> = {
  headers: {
    topic: string;
    type: MessageType;
    correlationId: string;
    offset?: string;
    userRecord: UserDTO | null;
  };
  payload: T;
};

export type UserDTO = {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

export type FinancialDTO = {
  id?: string;
  income: string;
  expenses: string;
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

export type UserCreatePayload = {
  data: {
    success: boolean;
    user: UserDTO;
  };
};

export type ServerStatusPayload = {
  data: ServerStatus[];
};

export type ServerStatus = {
  service: string;
  status: string;
};

export type EmailUserPayload = {
  data: { email: string }
}

export type IdUserPayload = {
  data: { id: string }
}

export type IdLoanPayload = {
  data: {id: string}
}
export type UserIdLoanPayload = {
  data: {id: string}
}
export type LoanIdPaymentsPayload = {
  data: {id: string}
}

export class UserResponseDTO {
  data: UserPayload | UserPayload[] | undefined;
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
    loans: any[]
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

export type UserPayload = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  financialData?: FinancialData;
};

export type FinancialData = {
  creditScore?: number;
  income?: number;
  expenses?: number;
};

export type RequestUserDTO = {
  user: {
    id: string;
    email: string;
  }
};
