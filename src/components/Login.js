import React, { useState } from "react";
import {
  Box,
  Heading,
  Image,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Link,
  useToast,
  Flex,
} from "@chakra-ui/react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider, db } from "../Firebase";
import { useNavigate } from "react-router-dom";
import googleIcon from "../assets/google.png";
import { getDoc, doc } from "firebase/firestore";
import logo from "../assets/logo.png";

function Login({ doctor }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to the desired page after successful login
      navigate("/dashboard");
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        toast({
          title: "Invalid credentials",
          description:
            "The provided email or password is incorrect. Please enter valid credentials.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        console.error("Error logging in:", error);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if the user document exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        // User document exists, allow login and redirect to the desired page
        navigate("/dashboard");
      } else {
        // User document does not exist, show an error message
        toast({
          title: "Account does not exist",
          description:
            "Please sign up to create an account before logging in with Google.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        // Sign out the user to prevent unauthorized access
        await signOut(auth);
      }
    } catch (error) {
      console.error("Error logging in with Google:", error);
    }
  };

  return (
    <Box
      bg="gray.100"
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        bg="white"
        p={8}
        borderRadius="md"
        boxShadow="md"
        maxWidth="500px"
        width="100%"
      >
        <VStack spacing={6} align="stretch">
          <Flex justify="center" align="center" w="100%" h="100%">
            <Image src={logo} boxSize="50px" objectFit="contain" />
          </Flex>
          <Heading as="h1" size="xl" textAlign="center">
            Login
          </Heading>
          <form onSubmit={handleLogin}>
            <VStack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Button type="submit" colorScheme="blue" size="lg" width="100%">
                Login
              </Button>
            </VStack>
          </form>
          <Button
            onClick={handleGoogleLogin}
            bg="gray.300"
            colorScheme="gray"
            size="lg"
            width="100%"
            leftIcon={<Image src={googleIcon} alt="Google" boxSize="20px" />}
          >
            Login with Google
          </Button>
          <Text textAlign="center">
            Don't have an account?{" "}
            <Link color="blue.500" onClick={() => navigate("/signup")}>
              Sign up
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}

export default Login;
