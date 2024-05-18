import React, { useEffect, useState } from "react";
import { Box, Heading, Text, Input, Stack, Button } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../Firebase";

const CompanyPage = () => {
  const { companySlug } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [jobListings, setJobListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCompany = async () => {
      const companiesRef = collection(db, "companies");
      const q = query(companiesRef, where("slug", "==", companySlug));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const companyData = querySnapshot.docs[0].data();
        setCompany(companyData);

        const companyId = querySnapshot.docs[0].id;
        const jobsRef = collection(db, "companies", companyId, "jobs");
        const jobsSnapshot = await getDocs(jobsRef);

        const jobsData = jobsSnapshot.docs.map((doc) => doc.data());
        setJobListings(jobsData);
      }
    };

    fetchCompany();
  }, [companySlug]);

  const handleJobClick = (jobListingId) => {
    navigate(`/${companySlug}/${jobListingId}`);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredJobListings = jobListings.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!company) {
    return <Text>Loading company information...</Text>;
  }

  return (
    <Box bg="gray.100" minHeight="100vh" p={8}>
      <Box maxWidth="container.lg" mx="auto" bg="white" p={8} borderRadius="lg" boxShadow="md">
        <Heading as="h1" size="2xl" mb={4}>
          {company.name}
        </Heading>
        <Input
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={handleSearchChange}
          mb={8}
        />
        <Stack spacing={6}>
          {filteredJobListings.map((job) => (
            <Box key={job.jobListingId} bg="gray.50" p={6} borderRadius="md" boxShadow="sm">
              <Heading as="h2" size="lg" mb={2}>
                {job.title}
              </Heading>
              <Text mb={4}>{job.description}</Text>
              <Button colorScheme="blue" onClick={() => handleJobClick(job.jobListingId)}>
                View Details
              </Button>
            </Box>
          ))}
        </Stack>
        {filteredJobListings.length === 0 && (
          <Text textAlign="center" fontSize="xl" mt={8}>
            No job listings found.
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default CompanyPage;