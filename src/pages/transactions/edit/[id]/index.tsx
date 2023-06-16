import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getTransactionById, updateTransactionById } from 'apiSdk/transactions';
import { Error } from 'components/error';
import { transactionValidationSchema } from 'validationSchema/transactions';
import { TransactionInterface } from 'interfaces/transaction';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { SmartContractInterface } from 'interfaces/smart-contract';
import { WalletInterface } from 'interfaces/wallet';
import { getSmartContracts } from 'apiSdk/smart-contracts';
import { getWallets } from 'apiSdk/wallets';

function TransactionEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<TransactionInterface>(
    () => (id ? `/transactions/${id}` : null),
    () => getTransactionById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: TransactionInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateTransactionById(id, values);
      mutate(updated);
      resetForm();
      router.push('/transactions');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<TransactionInterface>({
    initialValues: data,
    validationSchema: transactionValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Transaction
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="amount" mb="4" isInvalid={!!formik.errors?.amount}>
              <FormLabel>Amount</FormLabel>
              <NumberInput
                name="amount"
                value={formik.values?.amount}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('amount', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.amount && <FormErrorMessage>{formik.errors?.amount}</FormErrorMessage>}
            </FormControl>
            <FormControl id="timestamp" mb="4">
              <FormLabel>Timestamp</FormLabel>
              <Box display="flex" maxWidth="100px" alignItems="center">
                <DatePicker
                  dateFormat={'dd/MM/yyyy'}
                  selected={formik.values?.timestamp ? new Date(formik.values?.timestamp) : null}
                  onChange={(value: Date) => formik.setFieldValue('timestamp', value)}
                />
                <Box zIndex={2}>
                  <FiEdit3 />
                </Box>
              </Box>
            </FormControl>
            <AsyncSelect<SmartContractInterface>
              formik={formik}
              name={'smart_contract_id'}
              label={'Select Smart Contract'}
              placeholder={'Select Smart Contract'}
              fetcher={getSmartContracts}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <AsyncSelect<WalletInterface>
              formik={formik}
              name={'wallet_id'}
              label={'Select Wallet'}
              placeholder={'Select Wallet'}
              fetcher={getWallets}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.address}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'transaction',
  operation: AccessOperationEnum.UPDATE,
})(TransactionEditPage);
