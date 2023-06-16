import * as yup from 'yup';

export const smartContractValidationSchema = yup.object().shape({
  name: yup.string().required(),
  address: yup.string().required(),
  blockchain: yup.string().required(),
});
