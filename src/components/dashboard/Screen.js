import React, { useEffect, useState, useRef } from 'react';
import { Box, Heading, Button, VStack, Text, Input, InputGroup, InputLeftElement, Icon, Image, useToast } from '@chakra-ui/react';
import { SearchIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';

const Screen = () => {
  const [calls, setCalls] = useState([]);
  const [selectedCall, setSelectedCall] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    const fetchCalls = async () => {
      const options = {
        method: 'GET',
        headers: {
<<<<<<< HEAD
          Authorization: 'Bearer vapi',
=======
          Authorization: 'Bearer 7ef675d9-946d-4e8d-9fbe-3aa3d40b1e06',
>>>>>>> d6d3626 (Add folder to repository)
        },
      };
      try {
        setIsLoading(true);
        setCalls([]); // Reset the calls state before making the API call
        const response = await fetch(
          `https://api.vapi.ai/call?assistantId=611681d1-da5e-4c48-b47e-1b01f380bc5e`,
          options
        );
        if (!response.ok) {
          throw new Error('API key invalid');
        }
        const data = await response.json();
        setCalls(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching calls:', error);
        setIsLoading(false);
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
    fetchCalls();
  }, [toast]);

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return new Date(dateTimeString).toLocaleString('en-US', options);
  };

  const handleCallClick = (call) => {
    setSelectedCall(call);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const formatTranscript = (transcript) => {
    const lines = transcript.split('\n');
    const formattedLines = lines.map((line, index) => {
      if (line.startsWith('AI:') || line.startsWith('User:')) {
        return (
          <React.Fragment key={index}>
            {line}
            <br />
            <br />
          </React.Fragment>
        );
      }
      return line;
    });
    return formattedLines;
  };

  const formatDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationInSeconds = Math.floor((end - start) / 1000);
    const minutes = Math.floor(durationInSeconds / 60);
    const remainingSeconds = durationInSeconds % 60;
    return `${minutes} min ${remainingSeconds} sec`;
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCalls = calls.filter((call) => {
    const phoneNumber = call.customer?.number?.toLowerCase() || '';
    const date = formatDateTime(call.createdAt).toLowerCase();
    const searchLowerCase = searchTerm.toLowerCase();
    return phoneNumber.includes(searchLowerCase) || date.includes(searchLowerCase);
  });

  const renderFunctionCalls = (messages) => {
    const functionCalls = messages.filter((message) => message.role === 'function_call');
    if (functionCalls.length === 0) {
      return 'No functions ran';
    }
    return functionCalls.map((functionCall, index) => {
      const functionResult = messages.find(
        (message) => message.role === 'function_result' && message.time === functionCall.time
      );
      return (
        <React.Fragment key={index}>
          {functionCall.name}
          {functionResult && `, ${functionResult.result}`}
          {index !== functionCalls.length - 1 && '; '}
        </React.Fragment>
      );
    });
  };

  const handlePlayRecording = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Box display="flex" height="calc(100vh - 8rem)">
      <VStack spacing={4} align="stretch" mr={8} maxWidth="300px" height="100%">
        <Heading as="h2" size="xl">
          Calls
        </Heading>
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          {filteredCalls.length} Calls
        </Text>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={SearchIcon} color="gray.600" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search by phone or date"
            bg="gray.300"
            value={searchTerm}
            onChange={handleSearch}
          />
        </InputGroup>
        <Box
          height="calc(100% - 120px)"
          overflowY="scroll"
          css={{
            '&::-webkit-scrollbar': {
              width: '0px',
            },
            '&::-webkit-scrollbar-track': {
              width: '0px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'transparent',
            },
          }}
        >
          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <Image src="https://i.gifer.com/ZKZg.gif" alt="Loading" boxSize="50px" />
            </Box>
          ) : (
            <VStack spacing={2}>
              {filteredCalls.map((call) => (
                <Button
                  key={call.id}
                  variant={selectedCall && selectedCall.id === call.id ? 'solid' : 'outline'}
                  width="100%"
                  onClick={() => handleCallClick(call)}
                  bg="gray.200"
                >
                  {formatDateTime(call.createdAt)}
                </Button>
              ))}
            </VStack>
          )}
        </Box>
      </VStack>
      <Box flex={1}>
        {selectedCall ? (
          <>
            <Box display="flex" alignItems="center" mb={4}>
              <Heading as="h3" size="lg" mr={4}>
                Call Summary
              </Heading>
              <Button
                leftIcon={isPlaying ? <CloseIcon /> : <CheckIcon />}
                colorScheme={isPlaying ? 'red' : 'green'}
                onClick={handlePlayRecording}
              >
                {isPlaying ? 'Stop' : 'Play'} Recording
              </Button>
            </Box>
            <Box p={4} borderWidth={1} borderRadius="md" backgroundColor="gray.300" mb={4}>
              <Text>
                <strong>Phone Number:</strong> {selectedCall.customer?.number || 'N/A'}
              </Text>
              <Text>
                <strong>Date:</strong> {formatDateTime(selectedCall.createdAt)}
              </Text>
              <Text>
                <strong>Duration:</strong>{' '}
                {formatDuration(selectedCall.startedAt, selectedCall.endedAt)}
              </Text>
              <Text>
                <strong>Call Type:</strong> {selectedCall.type === 'inboundPhoneCall' ? 'Inbound' : 'Outbound'}
              </Text>
              <Text>
                <strong>End Reason:</strong> {selectedCall.endedReason}
              </Text>
              <Text>
                <strong>Functions Called:</strong> {renderFunctionCalls(selectedCall.messages)}
              </Text>
            </Box>
            <Heading as="h4" size="md" mb={2}>
              Transcript
            </Heading>
            <Box
              p={4}
              borderWidth={1}
              borderRadius="md"
              backgroundColor="gray.300"
              height="calc(100% - 300px)"
              overflowY="auto"
              css={{
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'gray',
                  borderRadius: '4px',
                },
              }}
            >
              <Text>{formatTranscript(selectedCall.transcript)}</Text>
            </Box>
            <audio ref={audioRef}>
              <source src={selectedCall.recordingUrl} type="audio/wav" />
            </audio>
          </>
        ) : (
          <Box
            p={4}
            borderWidth={1}
            borderRadius="md"
            backgroundColor="gray.300"
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text>Select a call to see the summary</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Screen;