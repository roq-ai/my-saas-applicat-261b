import { WalletInterface } from 'interfaces/wallet';
import { GetQueryInterface } from 'interfaces';

export interface BlacklistedWalletInterface {
  id?: string;
  wallet_id: string;
  reason: string;
  created_at?: any;
  updated_at?: any;

  wallet?: WalletInterface;
  _count?: {};
}

export interface BlacklistedWalletGetQueryInterface extends GetQueryInterface {
  id?: string;
  wallet_id?: string;
  reason?: string;
}
