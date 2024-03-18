import { FinancialData } from '../../shared-definitions/types-dto-constants';

export type FetchFinancialDataDTO = {
  status: string;
  data: FinancialData;
};
