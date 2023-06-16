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
import { getBlacklistedWalletById, updateBlacklistedWalletById } from 'apiSdk/blacklisted-wallets';
import { Error } from 'components/error';
import { blacklistedWalletValidationSchema } from 'validationSchema/blacklisted-wallets';
import { BlacklistedWalletInterface } from 'interfaces/blacklisted-wallet';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { WalletInterface } from 'interfaces/wallet';
import { getWallets } from 'apiSdk/wallets';

function BlacklistedWalletEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<BlacklistedWalletInterface>(
    () => (id ? `/blacklisted-wallets/${id}` : null),
    () => getBlacklistedWalletById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: BlacklistedWalletInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateBlacklistedWalletById(id, values);
      mutate(updated);
      resetForm();
      router.push('/blacklisted-wallets');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<BlacklistedWalletInterface>({
    initialValues: data,
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
            Edit Blacklisted Wallet
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'blacklisted_wallet',
  operation: AccessOperationEnum.UPDATE,
})(BlacklistedWalletEditPage);
