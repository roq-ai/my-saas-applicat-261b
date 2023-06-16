import axios from 'axios';
import queryString from 'query-string';
import { WalletInterface, WalletGetQueryInterface } from 'interfaces/wallet';
import { GetQueryInterface } from '../../interfaces';

export const getWallets = async (query?: WalletGetQueryInterface) => {
  const response = await axios.get(`/api/wallets${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createWallet = async (wallet: WalletInterface) => {
  const response = await axios.post('/api/wallets', wallet);
  return response.data;
};

export const updateWalletById = async (id: string, wallet: WalletInterface) => {
  const response = await axios.put(`/api/wallets/${id}`, wallet);
  return response.data;
};

export const getWalletById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/wallets/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteWalletById = async (id: string) => {
  const response = await axios.delete(`/api/wallets/${id}`);
  return response.data;
};
