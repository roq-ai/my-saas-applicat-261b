import { TransactionInterface } from 'interfaces/transaction';
import { GetQueryInterface } from 'interfaces';

export interface WalletInterface {
  id?: string;
  address: string;
  risk_score: number;
  created_at?: any;
  updated_at?: any;
  transaction?: TransactionInterface[];

  _count?: {
    transaction?: number;
  };
}

export interface WalletGetQueryInterface extends GetQueryInterface {
  id?: string;
  address?: string;
}
