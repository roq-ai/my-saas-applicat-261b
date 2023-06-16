import axios from 'axios';
import queryString from 'query-string';
import { BlacklistedWalletInterface, BlacklistedWalletGetQueryInterface } from 'interfaces/blacklisted-wallet';
import { GetQueryInterface } from '../../interfaces';

export const getBlacklistedWallets = async (query?: BlacklistedWalletGetQueryInterface) => {
  const response = await axios.get(`/api/blacklisted-wallets${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createBlacklistedWallet = async (blacklistedWallet: BlacklistedWalletInterface) => {
  const response = await axios.post('/api/blacklisted-wallets', blacklistedWallet);
  return response.data;
};

export const updateBlacklistedWalletById = async (id: string, blacklistedWallet: BlacklistedWalletInterface) => {
  const response = await axios.put(`/api/blacklisted-wallets/${id}`, blacklistedWallet);
  return response.data;
};

export const getBlacklistedWalletById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/blacklisted-wallets/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteBlacklistedWalletById = async (id: string) => {
  const response = await axios.delete(`/api/blacklisted-wallets/${id}`);
  return response.data;
};
