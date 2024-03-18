import { FinancialData } from '../../shared-definitions/types-dto-constants';

export type CreateFinancialDataDTO = {
  data: {
    success: string;
    financialData: FinancialData;
  };
};
