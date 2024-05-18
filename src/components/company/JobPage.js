import React, { useEffect, useState } from "react";
import { Box, Heading, Text, Stack, Button } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../Firebase";

const JobPage = () => {
  const { companySlug, jobListingId } = useParams();
  const navigate = useNavigate();
  const [jobListing, setJobListing] = useState(null);

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

  const handleApplyClick = () => {

    navigate(`/${companySlug}/${jobListingId}/apply`);
  };

  if (!jobListing) {
    return <Text>Loading job details...</Text>;
  }

  return (
    <Box bg="gray.100" minHeight="100vh" p={8}>
      <Box maxWidth="container.lg" mx="auto" bg="white" p={8} borderRadius="lg" boxShadow="md">
        <Heading as="h1" size="2xl" mb={4}>
          {jobListing.title}
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
              Description:
            </Text>
            <Text>{jobListing.description}</Text>
          </Box>
          <Box>
            <Text fontSize="xl" fontWeight="bold" mb={2}>
              Phone Number:
            </Text>
            <Text>{jobListing.phoneNumber}</Text>
          </Box>
          <Button colorScheme="blue" onClick={handleApplyClick}>
            Apply Now
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default JobPage;