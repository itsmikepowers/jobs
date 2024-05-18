import { Box, Heading, Text, Flex, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, SimpleGrid, Icon, VStack, Progress, Divider } from '@chakra-ui/react';
import { FaUser, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

const Overview = () => {
  return (
    <Box>
      <Heading size="xl" mb={8}>
        Overview
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} mb={8}>
        <Stat>
          <StatLabel>Total Candidates</StatLabel>
          <StatNumber>1,234</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            23.36%
          </StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Screened Candidates</StatLabel>
          <StatNumber>758</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            17.89%
          </StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Qualified Candidates</StatLabel>
          <StatNumber>432</StatNumber>
          <StatHelpText>
            <StatArrow type="decrease" />
            9.12%
          </StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Average Screening Time</StatLabel>
          <StatNumber>3 days</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            1.5 days
          </StatHelpText>
        </Stat>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mb={8}>
        <Box bg="blue.50" borderRadius="md" p={6}>
          <Heading size="lg" mb={4}>
            Candidate Funnel
          </Heading>
          <VStack spacing={6} align="stretch">
            <Flex align="center">
              <Icon as={FaUser} color="blue.500" boxSize={6} mr={4} />
              <Text fontSize="xl">Total Candidates: 1,234</Text>
            </Flex>
            <Flex align="center">
              <Icon as={FaCheckCircle} color="green.500" boxSize={6} mr={4} />
              <Text fontSize="xl">Screened: 758 (61.4%)</Text>
            </Flex>
            <Flex align="center">
              <Icon as={FaTimesCircle} color="red.500" boxSize={6} mr={4} />
              <Text fontSize="xl">Rejected: 476 (38.6%)</Text>
            </Flex>
            <Flex align="center">
              <Icon as={FaClock} color="yellow.500" boxSize={6} mr={4} />
              <Text fontSize="xl">In Progress: 120 (9.7%)</Text>
            </Flex>
          </VStack>
        </Box>

        <Box bg="blue.50" borderRadius="md" p={6}>
          <Heading size="lg" mb={4}>
            Screening Progress
          </Heading>
          <VStack spacing={6} align="stretch">
            <Box>
              <Text fontSize="xl" mb={2}>
                Application Review
              </Text>
              <Progress value={80} colorScheme="blue" size="lg" />
            </Box>
            <Box>
              <Text fontSize="xl" mb={2}>
                Phone Screening
              </Text>
              <Progress value={60} colorScheme="blue" size="lg" />
            </Box>
            <Box>
              <Text fontSize="xl" mb={2}>
                Technical Assessment
              </Text>
              <Progress value={45} colorScheme="blue" size="lg" />
            </Box>
            <Box>
              <Text fontSize="xl" mb={2}>
                Final Interview
              </Text>
              <Progress value={30} colorScheme="blue" size="lg" />
            </Box>
          </VStack>
        </Box>
      </SimpleGrid>

      <Divider mb={8} />

      <Heading size="lg" mb={4}>
        Recent Activity
      </Heading>
      <Box>
        {/* Add recent activity data or charts */}
      </Box>
    </Box>
  );
};

export default Overview;