import { SmartContractInterface } from 'interfaces/smart-contract';
import { WalletInterface } from 'interfaces/wallet';
import { GetQueryInterface } from 'interfaces';

export interface TransactionInterface {
  id?: string;
  smart_contract_id: string;
  wallet_id: string;
  amount: number;
  timestamp: any;
  created_at?: any;
  updated_at?: any;

  smart_contract?: SmartContractInterface;
  wallet?: WalletInterface;
  _count?: {};
}

export interface TransactionGetQueryInterface extends GetQueryInterface {
  id?: string;
  smart_contract_id?: string;
  wallet_id?: string;
}
