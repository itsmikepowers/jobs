import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Container,
  useColorModeValue,
  Text,
  Link,
  Flex,
} from "@chakra-ui/react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { db } from "../../Firebase";

const ApplicationDetail = () => {
  const [applications, setApplications] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const location = useLocation();
  const jobListingId = location.pathname.split("/").pop();

  useEffect(() => {
    const fetchApplicationsAndJobDetails = async () => {
      console.log("Fetching job and applications data...");
      console.log("Job Listing ID:", jobListingId);
      if (jobListingId) {
        const companiesRef = collection(db, "companies");
        const companiesSnapshot = await getDocs(companiesRef);

        let fetchedApplications = [];
        let jobData = null;

        for (const companyDoc of companiesSnapshot.docs) {
          const jobsRef = collection(db, "companies", companyDoc.id, "jobs");
          const q = query(jobsRef, where("jobListingId", "==", jobListingId));
          const jobsSnapshot = await getDocs(q);

          if (!jobsSnapshot.empty) {
            for (const jobDoc of jobsSnapshot.docs) {
              if (!jobData) {
                jobData = { ...jobDoc.data(), id: jobDoc.id };
              }
              const jobId = jobDoc.id;
              const applicationsRef = collection(
                db,
                "companies",
                companyDoc.id,
                "jobs",
                jobId,
                "applications"
              );
              const applicationsSnapshot = await getDocs(applicationsRef);
              const applicationsList = applicationsSnapshot.docs.map((doc) => ({
                id: doc.id,
                jobId: jobId,
                ...doc.data(),
              }));
              fetchedApplications = [
                ...fetchedApplications,
                ...applicationsList,
              ];
            }
          }
        }

        setJobDetails(jobData);
        setApplications(fetchedApplications);
      } else {
        console.log("Missing job listing ID");
      }
    };
    fetchApplicationsAndJobDetails();
  }, [jobListingId]);

  const boxBgColor = useColorModeValue("white", "gray.700");

  return (
    <Box>
      <Container maxWidth="container.lg">
        {jobDetails && (
          <Flex direction="column">
            <Heading as="h2" size="lg" mb={4}>
              {jobDetails.title} <br />
            </Heading>
            <Text>
              {jobDetails.city}, {jobDetails.country}
            </Text>
          </Flex>
        )}
        <Heading as="h2" size="lg" mb={4}>
          {applications.length > 0
            ? `You have ${applications.length} application${
                applications.length > 1 ? "s" : ""
              }.`
            : "No applications found."}
        </Heading>
        {applications.length > 0 &&
          applications.map((application) => (
            <Box
              key={`${application.jobId}-${application.id}`}
              p={6}
              borderWidth={1}
              borderRadius="md"
              boxShadow="md"
              bg={boxBgColor}
              mb={4}
            >
              <Text>
                <strong>Name:</strong> {application.name}
              </Text>
              <Text>
                <strong>Email:</strong> {application.email}
              </Text>
            </Box>
          ))}
      </Container>
    </Box>
  );
};

export default ApplicationDetail;
