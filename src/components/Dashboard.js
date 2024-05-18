import React, { useState, useEffect } from "react";
import {
  Button,
  Flex,
  Heading,
  InputGroup,
  InputLeftElement,
  Input,
  IconButton,
  Circle,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
  HStack,
  Box,
} from "@chakra-ui/react";
import {
  FiGrid,
  FiBarChart2,
  FiSettings,
  FiLayers,
  FiFileText,
  FiSearch,
  FiBell,
  FiHelpCircle,
  FiChevronDown,
  FiBriefcase,
} from "react-icons/fi";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../Firebase";
import { doc, getDoc } from "firebase/firestore";
import logo from "../assets/logo.png";

import { onAuthStateChanged } from "firebase/auth";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location.pathname);
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.firstName + " " + userData.lastName);
        }
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const menuItems = [
    { icon: FiGrid, label: "Overview", path: "overview" },
    { icon: FiBriefcase, label: "Job Posts", path: "job" },
    { icon: FiFileText, label: "Applications", path: "applications" },
    // { icon: FiThumbsUp, label: "Screened", path: "screen" },
    { icon: FiLayers, label: "Integrations", path: "integrations" },
    { icon: FiBarChart2, label: "Analytics", path: "analytics" },
    { icon: FiSettings, label: "Settings", path: "settings" },
  ];

  const getInitials = (name) => {
    const names = name.split(" ");
    const initials = names.map((name) => name.charAt(0)).join("");
    return initials.toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleSettings = async () => {
    navigate("/dashboard/settings");
  };

  return (
    <Flex>
      <Flex
        width="300px"
        height="100vh"
        bg="white"
        p={4}
        position="fixed"
        left={0}
        top={0}
        direction="column"
      >
        <Flex p={4}>
          <HStack>
            <Box boxSize="30px">
              <Image src={logo} boxSize="100%" objectFit="contain" />
            </Box>
            <Heading fontSize="3xl">Smart Screen</Heading>
          </HStack>
        </Flex>
        {menuItems.map(({ icon: Icon, label, path }) => (
          <Link key={path} to={path}>
            <Button
              leftIcon={<Icon />}
              fontSize={20}
              bg={activeTab === path ? "blue.500" : "white"}
              color={activeTab === path ? "white" : "#484848"}
              p={6}
              justifyContent="flex-start"
              _hover={{ bg: activeTab === path ? "blue.600" : "gray.200" }}
              borderRadius={10}
              onClick={() => setActiveTab(path)}
              w="100%"
              mb={2}
            >
              {label}
            </Button>
          </Link>
        ))}
      </Flex>
      <Flex
        ml="300px"
        width="calc(100% - 300px)"
        bg="gray.100"
        h="100vh"
        direction="column"
      >
        <Flex alignItems="center" pt={6} px={6}>
          <InputGroup mr={10} size="lg" borderColor="#f5f5f5">
            <InputLeftElement>
              <FiSearch fontSize="22px" />
            </InputLeftElement>
            <Input
              placeholder="Search Candidates, Job Posts, or Screenings"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              borderColor="gray.100"
            />
          </InputGroup>
          <Flex ml="auto" alignItems="center">
            <IconButton
              aria-label="Notifications"
              icon={<FiBell />}
              variant="ghost"
              mr={4}
              fontSize="22px"
              color="#222222"
            />
            <IconButton
              aria-label="Help"
              icon={<FiHelpCircle />}
              variant="ghost"
              mr={10}
              fontSize="22px"
              color="#222222"
            />
            <Circle size="50px" bg="blue.500" color="white" mr={4}>
              <Text fontSize="xl" fontWeight="bold">
                {getInitials(userName)}
              </Text>
            </Circle>
            <Flex alignItems="center" mr={4}>
              <Flex direction="column" alignItems="flex-start" mr={4}>
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  isTruncated
                  noOfLines={1}
                  lineHeight="1.2"
                  mb={2}
                >
                  {userName}
                </Text>
                <Text fontSize="md" lineHeight="1.2" whiteSpace="nowrap">
                  HR Manager
                </Text>
              </Flex>
              <Menu>
                <MenuButton as={Button} variant="ghost" alignSelf="center">
                  <FiChevronDown fontSize="28px" />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={handleSettings}>Settings</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>
        </Flex>
        <Box bg="gray.100" direction="column" flex={1} p={6}>
          <Outlet/>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Dashboard;
