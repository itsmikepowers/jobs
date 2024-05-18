import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Button,
  Input,
  Textarea,
  useToast,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { db } from "../../Firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { auth } from "../../Firebase";
import { useNavigate } from "react-router-dom";

const Company = () => {
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedInUserCompanyCode, setLoggedInUserCompanyCode] = useState(null);
  const [editedCompanyData, setEditedCompanyData] = useState(null);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  useEffect(() => {
    const fetchLoggedInUserCompanyCode = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = collection(db, "users");
          const q = query(userRef, where("email", "==", user.email));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            setLoggedInUserCompanyCode(userData.companyCode);
          }
        }
      } catch (error) {
        console.error("Error fetching logged-in user company code:", error);
      }
    };
    fetchLoggedInUserCompanyCode();
  }, []);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        if (loggedInUserCompanyCode) {
          const companiesRef = collection(db, "companies");
          const q = query(companiesRef, where("companyCode", "==", loggedInUserCompanyCode));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const companyDoc = querySnapshot.docs[0];
            const companyData = companyDoc.data();
            setCompanyData(companyData);
            setEditedCompanyData(companyData);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching company data:", error);
        setLoading(false);
      }
    };
    fetchCompanyData();
  }, [loggedInUserCompanyCode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCompanyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setIsSaveButtonDisabled(false);
  };

  const handleSaveChanges = async () => {
    try {
      if (loggedInUserCompanyCode) {
        const companiesRef = collection(db, "companies");
        const q = query(companiesRef, where("companyCode", "==", loggedInUserCompanyCode));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const companyDoc = querySnapshot.docs[0];
          await updateDoc(doc(db, "companies", companyDoc.id), editedCompanyData);
          setCompanyData(editedCompanyData);
          setIsSaveButtonDisabled(true);
          toast({
            title: "Changes saved",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    } catch (error) {
      console.error("Error saving company data:", error);
      toast({
        title: "Error saving changes",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSlugChange = (e) => {
    const { value } = e.target;
    setEditedCompanyData((prevData) => ({
      ...prevData,
      slug: value,
    }));
    setIsSaveButtonDisabled(false);
    onOpen();
  };

  const confirmSlugChange = () => {
    onClose();
    handleSaveChanges();
  };

  const handlePortalClick = () => {
    navigate(`/${editedCompanyData.slug}`);
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!companyData) {
    return (
      <Box textAlign="center" mt={10}>
        <Text>No company data available.</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading mb={6}>Company Settings</Heading>
      <Box>
        <Text fontWeight="bold">Company Code:</Text>
        <Text>{companyData.companyCode}</Text>
      </Box>
      <Box>
        <Text fontWeight="bold">Company Name:</Text>
        <Input
          name="name"
          value={editedCompanyData.name}
          onChange={handleInputChange}
        />
      </Box>
      <Box>
        <Text fontWeight="bold">Company Description:</Text>
        <Textarea
          name="description"
          value={editedCompanyData.description}
          onChange={handleInputChange}
        />
      </Box>
      <Box>
        <Text fontWeight="bold">Employee Size:</Text>
        <Input
          name="employeeSize"
          value={editedCompanyData.employeeSize}
          onChange={handleInputChange}
        />
      </Box>
      <Box>
        <Text fontWeight="bold">Slug:</Text>
        <Input name="slug" value={editedCompanyData.slug} onChange={handleSlugChange} />
      </Box>
      <Box mt={8}>
        <Button
          colorScheme="blue"
          onClick={handleSaveChanges}
          disabled={isSaveButtonDisabled}
          mr={4}
        >
          Save Changes
        </Button>
        <Button colorScheme="blue" onClick={handlePortalClick}>
          Go to Company Portal
        </Button>
      </Box>
      {/* Confirmation popup for slug change */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Slug Change
            </AlertDialogHeader>
            <AlertDialogBody>
              By changing the slug, you may have broken links if you have already posted your job. Are you sure you want to proceed?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmSlugChange} ml={3}>
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Company;