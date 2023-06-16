import * as yup from 'yup';

export const transactionValidationSchema = yup.object().shape({
  amount: yup.number().integer().required(),
  timestamp: yup.date().required(),
  smart_contract_id: yup.string().nullable().required(),
  wallet_id: yup.string().nullable().required(),
});
