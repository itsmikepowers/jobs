import { Box, Heading, Button, Flex, Text, Container, Stack, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import hr from '../assets/hr.png'

const Home = () => {
  return (
    <Box>
      {/* Navbar */}
      <Box bg="blue.100" py={4}>
        <Container maxW="container.lg">
          <Flex justify="space-between" align="center">
            <Heading as="h1" size="lg" color="blue.600">
              Smart Screen
            </Heading>
            <Stack direction="row" spacing={4}>
              <Link to="/login">
                <Button colorScheme="blue" >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button colorScheme="blue">Sign Up</Button>
              </Link>
            </Stack>
          </Flex>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box py={28}>
        <Container maxW="container.lg">
          <Flex align="center" justify="space-between" wrap="wrap">
            <Box maxW="md" mr={{ base: 0, md: 8 }} mb={{ base: 8, md: 0 }}>
              <Heading as="h2" size="2xl" mb={6} color="blue.800">
                Innovative Screening Solutions for Your Recruiting Needs
              </Heading>
              <Text fontSize="xl" mb={8} color="blue.600">
                Smart Screen provides cutting-edge screening tools to streamline your hiring process and find the best
                candidates for your organization.
              </Text>
              <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                <Link to="/demo">
                  <Button colorScheme="blue" size="lg">
                    Try Demo
                  </Button>
                </Link>
              </Stack>
            </Box>
            <Box>
              <Image src={hr} w="500px" alt="Smart Screen" />
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box bg="blue.800" py={16} color="white">
        <Container maxW="container.lg" textAlign="center">
          <Heading as="h2" size="xl" mb={6}>
            Ready to Revolutionize Your Hiring Process?
          </Heading>
          <Text fontSize="xl" mb={8}>
            Sign up today and start using Smart Screen to find the best talent for your organization.
          </Text>
          <Link to="/signup">
            <Button colorScheme="blue" size="lg">
              Get Started
            </Button>
          </Link>
        </Container>
      </Box>

      {/* Footer */}
      <Box bg="gray.100" py={8}>
        <Container maxW="container.lg" textAlign="center">
          <Text>&copy; {new Date().getFullYear()} Smart Screen. All rights reserved.</Text>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;