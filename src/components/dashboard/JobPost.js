import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Container,
  useColorModeValue,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Switch,
  Select,
  useToast,
} from '@chakra-ui/react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';
import { db } from '../../Firebase';

const JobPost = () => {
  const [jobPost, setJobPost] = useState(null);
  const [initialJobPost, setInitialJobPost] = useState(null);
  const location = useLocation();
  const jobListingId = location.pathname.split('/').pop();
  const toast = useToast();

  useEffect(() => {
    const fetchJobPost = async () => {
      console.log('Fetching job data...');
      console.log('Listing ID:', jobListingId);
      if (jobListingId) {
        const companiesRef = collection(db, 'companies');
        const companiesSnapshot = await getDocs(companiesRef);
        for (const companyDoc of companiesSnapshot.docs) {
          const jobsRef = collection(db, 'companies', companyDoc.id, 'jobs');
          const jobsSnapshot = await getDocs(jobsRef);
          const job = jobsSnapshot.docs.find(
            (doc) => doc.data().jobListingId === jobListingId
          );
          if (job) {
            const jobData = { id: job.id, ...job.data() };
            setJobPost(jobData);
            setInitialJobPost(jobData);
            break;
          }
        }
      } else {
        console.log('Missing listing ID');
      }
    };
    fetchJobPost();
  }, [jobListingId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setJobPost((prevJobPost) => ({
      ...prevJobPost,
      [name]: inputValue,
    }));
  };

  const handleSaveClick = async () => {
    try {
      const companiesRef = collection(db, 'companies');
      const companiesSnapshot = await getDocs(companiesRef);
      for (const companyDoc of companiesSnapshot.docs) {
        const jobsRef = collection(db, 'companies', companyDoc.id, 'jobs');
        const jobsSnapshot = await getDocs(jobsRef);
        const job = jobsSnapshot.docs.find(
          (doc) => doc.data().jobListingId === jobListingId
        );
        if (job) {
          const jobRef = doc(db, 'companies', companyDoc.id, 'jobs', job.id);
          await updateDoc(jobRef, jobPost);
          setInitialJobPost(jobPost);
          toast({
            title: 'Job post saved.',
            description: 'The job post has been successfully saved.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          break;
        }
      }
    } catch (error) {
      console.error('Error updating job post:', error);
      toast({
        title: 'Error saving job post.',
        description: 'An error occurred while saving the job post.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const isJobPostChanged = JSON.stringify(jobPost) !== JSON.stringify(initialJobPost);

  const boxBgColor = useColorModeValue('white', 'gray.700');
  const inputBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box>
      <Container maxWidth="container.lg">
        {jobPost ? (
          <Box p={6} borderWidth={1} borderRadius="md" boxShadow="md" bg={boxBgColor}>
            <FormControl mb={4}>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                name="title"
                value={jobPost.title || ''}
                onChange={handleInputChange}
                bg={inputBgColor}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={jobPost.description || ''}
                onChange={handleInputChange}
                bg={inputBgColor}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="text"
                name="phoneNumber"
                value={jobPost.phoneNumber || ''}
                onChange={handleInputChange}
                bg={inputBgColor}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Company</FormLabel>
              <Input
                type="text"
                name="companyName"
                value={jobPost.companyName || ''}
                onChange={handleInputChange}
                bg={inputBgColor}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>City</FormLabel>
              <Input
                type="text"
                name="city"
                value={jobPost.city || ''}
                onChange={handleInputChange}
                bg={inputBgColor}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Country</FormLabel>
              <Input
                type="text"
                name="country"
                value={jobPost.country || ''}
                onChange={handleInputChange}
                bg={inputBgColor}
              />
            </FormControl>
            <FormControl display="flex" alignItems="center" mb={4}>
              <FormLabel htmlFor="phoneBot" mb="0">
                Phone Bot
              </FormLabel>
              <Switch
                id="phoneBot"
                name="phoneBot"
                isChecked={jobPost.phoneBot || false}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl display="flex" alignItems="center" mb={4}>
              <FormLabel htmlFor="resume" mb="0">
                Resume
              </FormLabel>
              <Switch
                id="resume"
                name="resume"
                isChecked={jobPost.resume || false}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl display="flex" alignItems="center" mb={4}>
              <FormLabel htmlFor="coverLetter" mb="0">
                Cover Letter
              </FormLabel>
              <Switch
                id="coverLetter"
                name="coverLetter"
                isChecked={jobPost.coverLetter || false}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Status</FormLabel>
              <Select
                name="status"
                value={jobPost.status || 'draft'}
                onChange={handleInputChange}
                bg={inputBgColor}
              >
                <option value="draft">Draft</option>
                <option value="live">Live</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="deleted">Deleted</option>
              </Select>
            </FormControl>
            <Button
              colorScheme="blue"
              onClick={handleSaveClick}
              disabled={!isJobPostChanged}
            >
              Save
            </Button>
          </Box>
        ) : (
          <Heading>Loading job post...</Heading>
        )}
      </Container>
    </Box>
  );
};

export default JobPost;