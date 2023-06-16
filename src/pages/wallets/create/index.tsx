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
import { createWallet } from 'apiSdk/wallets';
import { Error } from 'components/error';
import { walletValidationSchema } from 'validationSchema/wallets';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { WalletInterface } from 'interfaces/wallet';

function WalletCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: WalletInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createWallet(values);
      resetForm();
      router.push('/wallets');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<WalletInterface>({
    initialValues: {
      address: '',
      risk_score: 0,
    },
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
            Create Wallet
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'wallet',
  operation: AccessOperationEnum.CREATE,
})(WalletCreatePage);
