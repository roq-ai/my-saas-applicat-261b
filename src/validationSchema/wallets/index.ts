import * as yup from 'yup';

export const walletValidationSchema = yup.object().shape({
  address: yup.string().required(),
  risk_score: yup.number().integer().required(),
});
