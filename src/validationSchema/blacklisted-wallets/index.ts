import * as yup from 'yup';

export const blacklistedWalletValidationSchema = yup.object().shape({
  reason: yup.string().required(),
  wallet_id: yup.string().nullable().required(),
});
