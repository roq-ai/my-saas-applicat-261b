import { TransactionInterface } from 'interfaces/transaction';
import { GetQueryInterface } from 'interfaces';

export interface SmartContractInterface {
  id?: string;
  name: string;
  address: string;
  blockchain: string;
  created_at?: any;
  updated_at?: any;
  transaction?: TransactionInterface[];

  _count?: {
    transaction?: number;
  };
}

export interface SmartContractGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  address?: string;
  blockchain?: string;
}
