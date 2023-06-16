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
import { getSmartContractById, updateSmartContractById } from 'apiSdk/smart-contracts';
import { Error } from 'components/error';
import { smartContractValidationSchema } from 'validationSchema/smart-contracts';
import { SmartContractInterface } from 'interfaces/smart-contract';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';

function SmartContractEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<SmartContractInterface>(
    () => (id ? `/smart-contracts/${id}` : null),
    () => getSmartContractById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: SmartContractInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateSmartContractById(id, values);
      mutate(updated);
      resetForm();
      router.push('/smart-contracts');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<SmartContractInterface>({
    initialValues: data,
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
            Edit Smart Contract
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'smart_contract',
  operation: AccessOperationEnum.UPDATE,
})(SmartContractEditPage);
