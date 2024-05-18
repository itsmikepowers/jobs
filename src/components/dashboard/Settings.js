import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Button, VStack, Spinner } from "@chakra-ui/react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../../Firebase";
import { doc, getDoc } from "firebase/firestore";

const Settings = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!userData) {
    return (
      <Box textAlign="center" mt={10}>
        <Text>No user data available.</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading mb={6}>Settings</Heading>
      <VStack spacing={4} align="stretch">
        <Box>
          <Text fontWeight="bold">Company Name</Text>
          <Text>{userData.companyCode}</Text>
        </Box>
        <Box>
          <Link to={"/dashboard/settings/company"}>
            <Button colorScheme="blue">Go to Company Settings</Button>
          </Link>
        </Box>
        <Box>
          <Text fontWeight="bold">Email:</Text>
          <Text>{userData.email}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">First Name:</Text>
          <Text>{userData.firstName}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Last Name:</Text>
          <Text>{userData.lastName}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Phone Number:</Text>
          <Text>{userData.phoneNumber || "N/A"}</Text>
        </Box>
        <Box>
          <Button colorScheme="red" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default Settings;
