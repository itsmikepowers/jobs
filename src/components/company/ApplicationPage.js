import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  Button,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from "../../Firebase";

const ApplicationPage = () => {
  const { companySlug, jobListingId } = useParams();
  const navigate = useNavigate();
  const [jobListing, setJobListing] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);

  useEffect(() => {
    const fetchJobListing = async () => {
      const companiesRef = collection(db, "companies");
      const companyQuery = query(companiesRef, where("slug", "==", companySlug));
      const companySnapshot = await getDocs(companyQuery);
      if (!companySnapshot.empty) {
        const companyId = companySnapshot.docs[0].id;
        const jobsRef = collection(db, "companies", companyId, "jobs");
        const jobQuery = query(jobsRef, where("jobListingId", "==", jobListingId));
        const jobSnapshot = await getDocs(jobQuery);
        if (!jobSnapshot.empty) {
          const jobData = jobSnapshot.docs[0].data();
          setJobListing(jobData);
        }
      }
    };
    fetchJobListing();
  }, [companySlug, jobListingId]);

  const uploadFile = async (file) => {
    const storage = getStorage();
    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    try {
      await uploadTask;
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Upload resume and cover letter to Firebase Storage
    let resumeURL = null;
    let coverLetterURL = null;
  
    if (resume) {
      resumeURL = await uploadFile(resume);
    }
  
    if (coverLetter) {
      coverLetterURL = await uploadFile(coverLetter);
    }
  
    // Get the reference to the job document
    const companiesRef = collection(db, "companies");
    const companyQuery = query(companiesRef, where("slug", "==", companySlug));
    const companySnapshot = await getDocs(companyQuery);
    if (!companySnapshot.empty) {
      const companyId = companySnapshot.docs[0].id;
      const jobsRef = collection(db, "companies", companyId, "jobs");
      const jobQuery = query(jobsRef, where("jobListingId", "==", jobListingId));
      const jobSnapshot = await getDocs(jobQuery);
      if (!jobSnapshot.empty) {
        const jobId = jobSnapshot.docs[0].id;
  
        // Create a new application document in the "applications" subcollection of the job document
        const applicationsRef = collection(db, "companies", companyId, "jobs", jobId, "applications");
        await addDoc(applicationsRef, {
          name,
          email,
          resumeURL,
          coverLetterURL,
          // Add the timestamp field
          timestamp: Timestamp.now(),
          // Add any other relevant fields
        });
  
        // Reset form fields
        setName("");
        setEmail("");
        setResume(null);
        setCoverLetter(null);
  
        // Redirect to a success page or show a success message
        navigate(`/${companySlug}/${jobListingId}/apply/success`);
      }
    }
  };

  if (!jobListing) {
    return <Text>Loading job details...</Text>;
  }

  return (
    <Box bg="gray.100" minHeight="100vh" p={8}>
      <Box maxWidth="container.lg" mx="auto" bg="white" p={8} borderRadius="lg" boxShadow="md">
        <Heading as="h1" size="2xl" mb={4}>
          Apply for {jobListing.title}
        </Heading>
        <Stack spacing={6}>
          <Box>
            <Text fontSize="xl" fontWeight="bold" mb={2}>
              Company:
            </Text>
            <Text>{jobListing.companyName}</Text>
          </Box>
          <Box>
            <Text fontSize="xl" fontWeight="bold" mb={2}>
              Location:
            </Text>
            <Text>
              {jobListing.city}, {jobListing.country}
            </Text>
          </Box>
          <Box>
            <Text fontSize="xl" fontWeight="bold" mb={2}>
              Description:
            </Text>
            <Text>{jobListing.description}</Text>
          </Box>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FormControl>
              {jobListing.resume && (
                <FormControl>
                  <FormLabel>Resume</FormLabel>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResume(e.target.files[0])}
                    required
                  />
                </FormControl>
              )}
              {jobListing.coverLetter && (
                <FormControl>
                  <FormLabel>Cover Letter</FormLabel>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setCoverLetter(e.target.files[0])}
                    required
                  />
                </FormControl>
              )}
              <Button type="submit" colorScheme="blue">
                Submit
              </Button>
            </Stack>
          </form>
        </Stack>
      </Box>
    </Box>
  );
};

export default ApplicationPage;