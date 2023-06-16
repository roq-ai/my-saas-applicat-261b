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
import { createSmartContract } from 'apiSdk/smart-contracts';
import { Error } from 'components/error';
import { smartContractValidationSchema } from 'validationSchema/smart-contracts';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { SmartContractInterface } from 'interfaces/smart-contract';

function SmartContractCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: SmartContractInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createSmartContract(values);
      resetForm();
      router.push('/smart-contracts');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<SmartContractInterface>({
    initialValues: {
      name: '',
      address: '',
      blockchain: '',
    },
    validationSchema: smartContractValidationSchema,
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
            Create Smart Contract
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="address" mb="4" isInvalid={!!formik.errors?.address}>
            <FormLabel>Address</FormLabel>
            <Input type="text" name="address" value={formik.values?.address} onChange={formik.handleChange} />
            {formik.errors.address && <FormErrorMessage>{formik.errors?.address}</FormErrorMessage>}
          </FormControl>
          <FormControl id="blockchain" mb="4" isInvalid={!!formik.errors?.blockchain}>
            <FormLabel>Blockchain</FormLabel>
            <Input type="text" name="blockchain" value={formik.values?.blockchain} onChange={formik.handleChange} />
            {formik.errors.blockchain && <FormErrorMessage>{formik.errors?.blockchain}</FormErrorMessage>}
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
  entity: 'smart_contract',
  operation: AccessOperationEnum.CREATE,
})(SmartContractCreatePage);
