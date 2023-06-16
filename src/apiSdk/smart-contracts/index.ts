import axios from 'axios';
import queryString from 'query-string';
import { SmartContractInterface, SmartContractGetQueryInterface } from 'interfaces/smart-contract';
import { GetQueryInterface } from '../../interfaces';

export const getSmartContracts = async (query?: SmartContractGetQueryInterface) => {
  const response = await axios.get(`/api/smart-contracts${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createSmartContract = async (smartContract: SmartContractInterface) => {
  const response = await axios.post('/api/smart-contracts', smartContract);
  return response.data;
};

export const updateSmartContractById = async (id: string, smartContract: SmartContractInterface) => {
  const response = await axios.put(`/api/smart-contracts/${id}`, smartContract);
  return response.data;
};

export const getSmartContractById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/smart-contracts/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteSmartContractById = async (id: string) => {
  const response = await axios.delete(`/api/smart-contracts/${id}`);
  return response.data;
};
