import { useState, useEffect } from "react";
import { Box, Heading, Container, useColorModeValue, Text, Link } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../../Firebase";

const ApplicationPerson = () => {
  const [application, setApplication] = useState(null);
  const { jobListingId, applicationId } = useParams();
  const boxBgColor = useColorModeValue("white", "gray.700");

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      if (applicationId) {
        const applicationRef = doc(db, "companies", "companyId", "jobs", "jobId", "applications", applicationId);
        const applicationSnapshot = await getDoc(applicationRef);
        if (applicationSnapshot.exists()) {
          setApplication({ id: applicationSnapshot.id, ...applicationSnapshot.data() });
        } else {
          console.log("Application not found");
        }
      }
    };

    fetchApplicationDetails();
  }, [applicationId]);

  return (
    <Box>
      <Container maxWidth="container.lg">
        <Heading as="h2" size="lg" mb={4}>
          Application Details
        </Heading>
        {application ? (
          <Box p={6} borderWidth={1} borderRadius="md" boxShadow="md" bg={boxBgColor} mb={4}>
            <Text>
              <strong>Name:</strong> {application.name}
            </Text>
            <Text>
              <strong>Email:</strong> {application.email}
            </Text>
            {application.resumeURL && (
              <Text>
                <strong>Resume:</strong>{" "}
                <Link href={application.resumeURL} isExternal>
                  View Resume
                </Link>
              </Text>
            )}
            {application.coverLetterURL && (
              <Text>
                <strong>Cover Letter:</strong>{" "}
                <Link href={application.coverLetterURL} isExternal>
                  View Cover Letter
                </Link>
              </Text>
            )}
          </Box>
        ) : (
          <Text>Loading...</Text>
        )}
      </Container>
    </Box>
  );
};

export default ApplicationPerson;