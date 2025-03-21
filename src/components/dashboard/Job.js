import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Container,
  useColorModeValue,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { auth, db } from '../../Firebase';
import { doc, getDoc, collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Job = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [companyData, setCompanyData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const companyCode = userDoc.data().companyCode;
          const companiesRef = collection(db, 'companies');
          const companyQuery = query(companiesRef, where('companyCode', '==', companyCode));
          const companySnapshot = await getDocs(companyQuery);
          if (!companySnapshot.empty) {
            const companyDoc = companySnapshot.docs[0];
            setCompanyData({ id: companyDoc.id, ...companyDoc.data() });
          }
        }
      }
    };
    fetchCompanyData();
  }, []);

  useEffect(() => {
    if (companyData && companyData.id) {
      const jobsRef = collection(db, 'companies', companyData.id, 'jobs');
      const unsubscribe = onSnapshot(jobsRef, (snapshot) => {
        const jobs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJobPosts(jobs);
      });
      return () => unsubscribe();
    }
  }, [companyData]);

  const handleJobClick = (jobListingId) => {
    navigate(`/dashboard/job/${jobListingId}`);
  };

  const handleAddJobClick = () => {
    navigate('/dashboard/job/new');
  };

  const boxBgColor = useColorModeValue('white', 'gray.700');

  return (
    <Box>
      <Heading mb={8}>Job Posts</Heading>
      <Container maxWidth="container.lg">
        <SimpleGrid columns={[1, 2, 3]} spacing={8}>
          <Box
            p={6}
            borderWidth={1}
            borderRadius="md"
            boxShadow="md"
            bg={boxBgColor}
            cursor="pointer"
            onClick={handleAddJobClick}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={AddIcon} boxSize={20} mb={4} />
            <Heading size="md">Add New Job</Heading>
          </Box>
          {jobPosts.map((jobPost) => (
            <Box
              key={jobPost.id}
              p={6}
              borderWidth={1}
              borderRadius="md"
              boxShadow="md"
              bg={boxBgColor}
              cursor="pointer"
              onClick={() => handleJobClick(jobPost.jobListingId)}
            >
              <Heading size="md">{jobPost.title}</Heading>
              <Text mt={2}>{jobPost.description}</Text>
              <Text mt={2}>Phone Number: {jobPost.phoneNumber}</Text>
              <Text mt={2}>Company: {jobPost.companyName}</Text>
              <Text mt={2} fontSize="sm" color="gray.600">
                Job ID: {jobPost.jobListingId}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Job;