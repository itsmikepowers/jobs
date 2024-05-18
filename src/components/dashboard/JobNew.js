import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  useColorModeValue,
  Select,
  Switch,
  FormHelperText,
} from '@chakra-ui/react';
import { auth, db } from '../../Firebase';
import { collection, addDoc, doc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const JobNew = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [companyData, setCompanyData] = useState(null);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [phoneBot, setPhoneBot] = useState(false);
  const [resume, setResume] = useState(false);
  const [coverLetter, setCoverLetter] = useState(false);
  const [status, setStatus] = useState('draft');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title && description && companyData && country && city && status) {
      const phoneNumber = generateRandomPhoneNumber();
      const jobListingId = generateRandomJobListingId();
      const timestamp = new Date().toISOString();
      try {
        const jobsRef = collection(db, 'companies', companyData.id, 'jobs');
        const newJobRef = await addDoc(jobsRef, {
          companyCode: companyData.companyCode,
          companyName: companyData.name,
          title,
          description,
          phoneNumber,
          jobListingId,
          createdAt: timestamp,
          country,
          city,
          phoneBot,
          resume,
          coverLetter,
          status,
        });
        console.log('New job added with ID:', newJobRef.id);
        setTitle('');
        setDescription('');
        setCountry('');
        setCity('');
        setPhoneBot(false);
        setResume(false);
        setCoverLetter(false);
        setStatus('draft');
        navigate("/dashboard/job/");
      } catch (error) {
        console.error('Error adding job post:', error);
      }
    }
  };

  const generateRandomPhoneNumber = () => {
    const phoneNumber = '1' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    return phoneNumber;
  };

  const generateRandomJobListingId = () => {
    const jobListingId = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
    return jobListingId;
  };

  const boxBgColor = useColorModeValue('white', 'gray.700');
  const inputBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box>
      <Heading mb={8}>Add New Job Post</Heading>
      <Box
        p={6}
        borderWidth={1}
        borderRadius="md"
        boxShadow="md"
        bg={boxBgColor}
        maxWidth="500px"
        width="100%"
        margin="0 auto"
      >
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter job title"
                bg={inputBgColor}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Company Name</FormLabel>
              <Input type="text" value={companyData?.name || ''} readOnly bg={inputBgColor} />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter job description"
                bg={inputBgColor}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Country</FormLabel>
              <Input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Enter country"
                bg={inputBgColor}
              />
            </FormControl>
            <FormControl>
              <FormLabel>City</FormLabel>
              <Input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
                bg={inputBgColor}
              />
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="phoneBot" mb="0">
                Phone Bot
              </FormLabel>
              <Switch id="phoneBot" isChecked={phoneBot} onChange={(e) => setPhoneBot(e.target.checked)} />
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="resume" mb="0">
                Resume
              </FormLabel>
              <Switch id="resume" isChecked={resume} onChange={(e) => setResume(e.target.checked)} />
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="coverLetter" mb="0">
                Cover Letter
              </FormLabel>
              <Switch id="coverLetter" isChecked={coverLetter} onChange={(e) => setCoverLetter(e.target.checked)} />
            </FormControl>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select value={status} onChange={(e) => setStatus(e.target.value)} bg={inputBgColor}>
                <option value="draft">Draft</option>
                <option value="live">Live</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="deleted">Deleted</option>
              </Select>
              <FormHelperText>Select the status of the job post</FormHelperText>
            </FormControl>
            <Button type="submit" colorScheme="blue" width="full">
              Add Job Post
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default JobNew;