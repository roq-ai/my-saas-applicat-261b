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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createBlacklistedWallet } from 'apiSdk/blacklisted-wallets';
import { Error } from 'components/error';
import { blacklistedWalletValidationSchema } from 'validationSchema/blacklisted-wallets';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { WalletInterface } from 'interfaces/wallet';
import { getWallets } from 'apiSdk/wallets';
import { BlacklistedWalletInterface } from 'interfaces/blacklisted-wallet';

function BlacklistedWalletCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: BlacklistedWalletInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createBlacklistedWallet(values);
      resetForm();
      router.push('/blacklisted-wallets');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<BlacklistedWalletInterface>({
    initialValues: {
      reason: '',
      wallet_id: (router.query.wallet_id as string) ?? null,
    },
    validationSchema: blacklistedWalletValidationSchema,
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
            Create Blacklisted Wallet
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="reason" mb="4" isInvalid={!!formik.errors?.reason}>
            <FormLabel>Reason</FormLabel>
            <Input type="text" name="reason" value={formik.values?.reason} onChange={formik.handleChange} />
            {formik.errors.reason && <FormErrorMessage>{formik.errors?.reason}</FormErrorMessage>}
          </FormControl>
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'blacklisted_wallet',
  operation: AccessOperationEnum.CREATE,
})(BlacklistedWalletCreatePage);
