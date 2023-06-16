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
import { getWalletById, updateWalletById } from 'apiSdk/wallets';
import { Error } from 'components/error';
import { walletValidationSchema } from 'validationSchema/wallets';
import { WalletInterface } from 'interfaces/wallet';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';

function WalletEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<WalletInterface>(
    () => (id ? `/wallets/${id}` : null),
    () => getWalletById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: WalletInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateWalletById(id, values);
      mutate(updated);
      resetForm();
      router.push('/wallets');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<WalletInterface>({
    initialValues: data,
    validationSchema: walletValidationSchema,
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
            Edit Wallet
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
            <FormControl id="address" mb="4" isInvalid={!!formik.errors?.address}>
              <FormLabel>Address</FormLabel>
              <Input type="text" name="address" value={formik.values?.address} onChange={formik.handleChange} />
              {formik.errors.address && <FormErrorMessage>{formik.errors?.address}</FormErrorMessage>}
            </FormControl>
            <FormControl id="risk_score" mb="4" isInvalid={!!formik.errors?.risk_score}>
              <FormLabel>Risk Score</FormLabel>
              <NumberInput
                name="risk_score"
                value={formik.values?.risk_score}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('risk_score', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.risk_score && <FormErrorMessage>{formik.errors?.risk_score}</FormErrorMessage>}
            </FormControl>

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
  entity: 'wallet',
  operation: AccessOperationEnum.UPDATE,
})(WalletEditPage);
