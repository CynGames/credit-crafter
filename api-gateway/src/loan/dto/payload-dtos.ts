export type LoanCreatePayload = {
    status: string,
    data: LoanCreateResponseDto;
  };
  
  export type LoanFetchPayload = {
    status: string
    data: {
      loans: any[]
    }
  };
  
  export type LoanCreateResponseDto = {
      id?: string;
      error?: Error;
  };
  
  export type LoanUpdatePayload = {
    status: string,
    data: LoanUpdateResponse
  }
  export type LoanFetchRespond = {
    loan: any;
  }
  export type LoanUpdateRequest = {
    loanId: string;
    state: string;
  }
  export type LoanUpdateResponse = {
      loanId: string,
      state: string,
      error?: string
  }