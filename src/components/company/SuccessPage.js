import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();
  const { companySlug } = useParams();

  const handleBackToCompany = () => {
    navigate(`/${companySlug}`);
  };

  return (
    <Box bg="gray.100" minHeight="100vh" p={8}>
      <Box maxWidth="container.lg" mx="auto" bg="white" p={8} borderRadius="lg" boxShadow="md" textAlign="center">
        <Heading as="h1" size="2xl" mb={4}>
          You applied to the position!
        </Heading>
        <Text fontSize="xl" mb={8}>
          Thank you for your application. We will review it and get back to you shortly.
        </Text>
        <Button colorScheme="blue" onClick={handleBackToCompany}>
          Check out our other roles
        </Button>
      </Box>
    </Box>
  );
};

export default SuccessPage;