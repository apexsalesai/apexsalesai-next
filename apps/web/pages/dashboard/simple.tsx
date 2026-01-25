import React from 'react';
import { Box, Heading, Text, SimpleGrid, Container } from '@chakra-ui/react';

// A simplified dashboard page that doesn't rely on complex data fetching
const SimpleDashboard: React.FC = () => {
  return (
    <Container maxW="1200px" p={8}>
      <Heading as="h1" size="xl" mb={6}>Simple Dashboard</Heading>
      
      <Box bg="blue.50" p={4} borderRadius="md" mb={6}>
        <Text fontWeight="bold">Status: If you can see this page, Chakra UI and React rendering are working correctly.</Text>
      </Box>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Box bg="white" p={5} borderRadius="lg" boxShadow="sm" borderWidth="1px">
          <Text fontSize="sm" color="gray.500" mb={1}>Deals Closed</Text>
          <Heading size="lg">42</Heading>
        </Box>
        <Box bg="white" p={5} borderRadius="lg" boxShadow="sm" borderWidth="1px">
          <Text fontSize="sm" color="gray.500" mb={1}>Meetings Booked</Text>
          <Heading size="lg">128</Heading>
        </Box>
        <Box bg="white" p={5} borderRadius="lg" boxShadow="sm" borderWidth="1px">
          <Text fontSize="sm" color="gray.500" mb={1}>Leads Rescued</Text>
          <Heading size="lg">37</Heading>
        </Box>
        <Box bg="white" p={5} borderRadius="lg" boxShadow="sm" borderWidth="1px">
          <Text fontSize="sm" color="gray.500" mb={1}>AI-Driven Revenue</Text>
          <Heading size="lg">$27,800</Heading>
        </Box>
      </SimpleGrid>
      
      <Box bg="gray.50" p={6} borderRadius="md" borderWidth="1px">
        <Heading size="md" mb={4}>Diagnostic Information</Heading>
        <Text mb={2}>• React is rendering correctly</Text>
        <Text mb={2}>• Chakra UI components are working</Text>
        <Text mb={2}>• Next.js Pages Router is handling this route</Text>
        <Text>• If this page works but the main dashboard doesn't, the issue is likely with data fetching or complex components</Text>
      </Box>
    </Container>
  );
};

export default SimpleDashboard;
