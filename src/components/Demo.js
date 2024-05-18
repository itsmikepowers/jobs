import React, { useState } from 'react';
import { Box, Heading, Input, Button, VStack, useToast, Select, Tooltip, FormControl, FormLabel, Text, Link } from '@chakra-ui/react';

const Demo = () => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');

    // Limit to 10 digits
    const limited = cleaned.slice(0, 10);

    // Format the number as (123) 456-7890
    const formatted = limited.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

    return formatted;
  };

  const isValidForm = () => {
    return name.trim() !== '' && number.replace(/\D/g, '').length === 10;
  };

  const getTooltipLabel = () => {
    if (isLoading) {
      return 'Loading...';
    } else if (name.trim() === '') {
      return 'Please enter a name';
    } else if (number.replace(/\D/g, '').length !== 10) {
      return 'Please enter a valid 10-digit phone number';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidForm()) {
      return;
    }

    try {
      setIsLoading(true);

      const options = {
        method: 'POST',
        headers: {
          Authorization: 'Bearer vapi',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assistantId: '611681d1-da5e-4c48-b47e-1b01f380bc5e',
          phoneNumber: {
            twilioAuthToken: '',
            twilioAccountSid: '',
            twilioPhoneNumber: '+19163892429',
          },
          customer: {
            number: countryCode + number.replace(/\D/g, ''),
          },
          assistantOverrides: {
            firstMessageMode: 'assistant-speaks-first',
            firstMessage: `Heyyy ${name}!!. We saw you recently applied for the python developer role at Horizon Labs, do you have a couple minutes to answer some questions?`,
          },
        }),
      };

      const response = await fetch('https://api.vapi.ai/call/phone', options);
      const data = await response.json();
      console.log(data);

      toast({
        title: 'Success',
        description: 'Phone interview initiated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reset the form fields
      setName('');
      setNumber('');
    } catch (error) {
      console.error('Error initiating phone interview:', error);
      toast({
        title: 'Error',
        description: 'Failed to initiate phone interview. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bg="gray.100" minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
      <Box bg="white" p={8} borderRadius="md" boxShadow="md" maxWidth="500px" width="100%">
        <VStack spacing={6} align="stretch">
          <Heading as="h1" size="xl" textAlign="center">
            Phone Interview Demo
          </Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl id="name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <FormControl id="phoneNumber" isRequired>
                <FormLabel>Phone Number</FormLabel>
                <Box display="flex" alignItems="center">
                  <Select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    width="170px"
                    mr={2}
                  >
                    <option value="+1">+1 (US)</option>
                    <option value="+44">+44 (UK)</option>
                    {/* Add more country codes as needed */}
                  </Select>
                  <Input
                    placeholder="Phone Number"
                    value={formatPhoneNumber(number)}
                    onChange={(e) => setNumber(e.target.value)}
                    maxLength={14}
                  />
                </Box>
              </FormControl>
              <Tooltip label={getTooltipLabel()} isDisabled={isValidForm()}>
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  width="100%"
                  isLoading={isLoading}
                  isDisabled={isLoading || !isValidForm()}
                >
                  Send Me a Phone Interview
                </Button>
              </Tooltip>
            </VStack>
          </form>
          <Text textAlign="center">
            Ready to get started?{' '}
            <Link color="blue.500" href="/">
              Go back to the dashboard
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default Demo;