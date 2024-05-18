import React, { useState } from 'react';
import { Box, Heading, VStack, FormControl, FormLabel, Input, Button, Text, useToast } from '@chakra-ui/react';
import { auth, db } from '../Firebase';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, collection, addDoc, query, where, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';

function Onboarding() {
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [employeeSize, setEmployeeSize] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleJoinCompany = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Query the 'companies' collection to find the company with the matching companyCode
        const companiesRef = collection(db, 'companies');
        const q = query(companiesRef, where('companyCode', '==', companyCode));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          const companyDoc = querySnapshot.docs[0];
  
          // Update the user's document in the 'users' collection with the company code and role
          await setDoc(doc(db, 'users', user.uid), {
            companyCode: companyCode,
            role: 'staff',
          }, { merge: true });
  
          // Add the user to the company's team array with the 'staff' role
          await updateDoc(companyDoc.ref, {
            team: arrayUnion({
              role: 'staff',
              email: user.email,
            }),
          });
  
          // Redirect to the appropriate page after joining a company
          navigate('/dashboard');
        } else {
          toast({
            title: 'Company not found',
            description: 'The provided company code is invalid. Please try again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      }
    } catch (error) {
      console.error('Error joining company:', error);
      toast({
        title: 'Error joining company',
        description: 'An error occurred while joining the company. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const generateCompanyCode = () => {
    const randomNumber = Math.floor(Math.random() * 1000000000000);
    return randomNumber.toString().padStart(12, '0');
  };

  const generateCompanySlug = (companyName) => {
    const lowercaseName = companyName.toLowerCase();
    const slugifiedName = lowercaseName.replace(/\s+/g, '-');
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `${slugifiedName}-${randomDigits}`;
  };

  const handleCreateCompany = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const companyCode = generateCompanyCode();
        const companySlug = generateCompanySlug(companyName);

        // Create a new document in the 'companies' collection
        await addDoc(collection(db, 'companies'), {
          companyCode: companyCode,
          name: companyName,
          slug: companySlug,
          description: companyDescription,
          employeeSize: employeeSize,
          team: [
            {
              role: 'owner',
              email: user.email,
            },
          ],
        });

        // Update the user's document in the 'users' collection with the company ID
        await setDoc(doc(db, 'users', user.uid), {
            companyCode: companyCode,
          role: 'owner',
        }, { merge: true });

        // Redirect to the appropriate page after creating a company
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error creating company:', error);
      toast({
        title: 'Error creating company',
        description: 'An error occurred while creating the company. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg="gray.100" minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
      <Box bg="white" p={8} borderRadius="md" boxShadow="md" maxWidth="500px" width="100%">
        <VStack spacing={6} align="stretch">
          <Heading as="h1" size="xl" textAlign="center">
            Onboarding
          </Heading>
          <Text>Join an existing company or create a new one:</Text>
          <VStack spacing={4}>
            <FormControl id="companyCode" isRequired>
              <FormLabel>Company Code</FormLabel>
              <Input type="text" value={companyCode} onChange={(e) => setCompanyCode(e.target.value)} />
            </FormControl>
            <Button onClick={handleJoinCompany} colorScheme="blue" size="lg" width="100%">
              Join Company
            </Button>
          </VStack>
          <Text textAlign="center">OR</Text>
          <VStack spacing={4}>
            <FormControl id="companyName" isRequired>
              <FormLabel>Company Name</FormLabel>
              <Input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </FormControl>
            <FormControl id="companyDescription" isRequired>
              <FormLabel>Company Description</FormLabel>
              <Input type="text" value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} />
            </FormControl>
            <FormControl id="employeeSize" isRequired>
              <FormLabel>Employee Size</FormLabel>
              <Input type="number" value={employeeSize} onChange={(e) => setEmployeeSize(e.target.value)} />
            </FormControl>
            <Button onClick={handleCreateCompany} colorScheme="blue" size="lg" width="100%">
              Create Company
            </Button>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
}

export default Onboarding;