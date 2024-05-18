import React, { useState } from 'react';
import { Box, Heading, Image, VStack, FormControl, FormLabel, Input, Button, Text, Link, HStack, useToast, Flex } from '@chakra-ui/react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '../Firebase';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import googleIcon from '../assets/google.png';
import logo from "../assets/logo.png";

function Signup({ doctor }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const addPatientToDatabase = async (user, firstName, lastName, phoneNumber) => {
    try {
      // Create a new document in the 'users' collection with the user's UID as the document ID
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
      });
    } catch (error) {
      console.error('Error adding patient to database:', error);
      throw error;
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Add the user to the 'users' collection
      await addPatientToDatabase(user, firstName, lastName, phoneNumber);
      // Redirect to the onboarding page after successful signup
      navigate('/onboarding');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast({
          title: 'Email already in use',
          description: 'The email address is already associated with an account. Please log in.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (error.code === 'auth/weak-password') {
        toast({
          title: 'Weak password',
          description: 'Password should be at least 6 characters long.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        console.error('Error signing up:', error);
        toast({
          title: 'Error signing up',
          description: 'An error occurred while signing up. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Extract the user's first name and last name from the Google profile
      const displayName = user.displayName;
      const nameParts = displayName.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      // Add the user to the 'user' collection with their first and last name
      await addPatientToDatabase(user, firstName, lastName, '');

      // Redirect to the onboarding page after successful signup
      navigate('/onboarding');
    } catch (error) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        toast({
          title: 'Email already in use',
          description: 'The email address is already associated with an account. Please log in.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        console.error('Error signing up with Google:', error);
      }
    }
  };

  return (
    <Box bg="gray.100" minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
      <Box bg="white" p={8} borderRadius="md" boxShadow="md" maxWidth="500px" width="100%">
        <VStack spacing={6} align="stretch">
          <Flex justify="center" align="center" w="100%" h="100%">
            <Image src={logo} boxSize="50px" objectFit="contain" />
          </Flex>
          <Heading as="h1" size="xl" textAlign="center">
            Sign Up
          </Heading>
          <form onSubmit={handleSignUp}>
            <VStack spacing={4}>
              <HStack spacing={4}>
                <FormControl id="firstName" isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </FormControl>
                <FormControl id="lastName" isRequired>
                  <FormLabel>Last Name</FormLabel>
                  <Input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </FormControl>
              </HStack>
              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </FormControl>
              <FormControl id="phoneNumber" isRequired>
                <FormLabel>Phone Number</FormLabel>
                <Input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </FormControl>
              <Button type="submit" colorScheme="blue" size="lg" width="100%">
                Sign Up
              </Button>
            </VStack>
          </form>
          <Button onClick={handleGoogleSignUp} bg="gray.300" colorScheme="gray" size="lg" width="100%" leftIcon={<Image src={googleIcon} alt="Google" boxSize="20px" />}>
            Sign Up with Google
          </Button>
          <Text textAlign="center">
            Already have an account?{' '}
            <Link color="blue.500" onClick={() => navigate(`/login`)}>
              Log in
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}

export default Signup;