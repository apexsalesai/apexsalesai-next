import React, { useState } from 'react';
import { Box, Heading, Text, Button, Flex, Badge, useColorModeValue, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure, VStack } from '@chakra-ui/react';

// Decision log entry type
interface DecisionLogEntry {
  id: number;
  timestamp: string;
  action: string;
  reasoning: string;
  confidence: number;
}

// Mock decision log data
const mockDecisionLog: DecisionLogEntry[] = [
  {
    id: 1,
    timestamp: '2025-06-25T10:23:15',
    action: 'Qualified lead as high-priority',
    reasoning: 'Lead showed interest in premium package and has budget authority',
    confidence: 0.92
  },
  {
    id: 2,
    timestamp: '2025-06-25T09:45:32',
    action: 'Scheduled follow-up call',
    reasoning: 'Lead requested more information about implementation timeline',
    confidence: 0.87
  },
  {
    id: 3,
    timestamp: '2025-06-25T08:12:05',
    action: 'Sent personalized email',
    reasoning: 'Lead has not responded in 3 days, personalized outreach needed',
    confidence: 0.76
  },
  {
    id: 4,
    timestamp: '2025-06-24T16:38:21',
    action: 'Updated lead status to "Negotiation"',
    reasoning: 'Lead has requested pricing details and comparison with competitors',
    confidence: 0.89
  }
];

// Decision detail modal component
const DecisionDetailModal = ({ 
  isOpen, 
  onClose, 
  decision 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  decision: DecisionLogEntry | null;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Decision Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {decision ? (
            <VStack align="stretch" spacing={4}>
              <Box>
                <Text fontWeight="bold" mb={1}>Action Taken</Text>
                <Text>{decision.action}</Text>
              </Box>
              
              <Box>
                <Text fontWeight="bold" mb={1}>Reasoning</Text>
                <Text>{decision.reasoning}</Text>
              </Box>
              
              <Box>
                <Text fontWeight="bold" mb={1}>Confidence Score</Text>
                <Badge 
                  colorScheme={decision.confidence > 0.85 ? "green" : decision.confidence > 0.7 ? "yellow" : "red"}
                  fontSize="0.9em"
                  px={2}
                  py={1}
                  borderRadius="md"
                >
                  {Math.round(decision.confidence * 100)}%
                </Badge>
              </Box>
              
              <Box>
                <Text fontWeight="bold" mb={1}>Timestamp</Text>
                <Text>{new Date(decision.timestamp).toLocaleString()}</Text>
              </Box>
              
              <Box mt={4}>
                <Button colorScheme="red" size="sm" mr={3}>
                  Override Decision
                </Button>
                <Button colorScheme="blue" size="sm">
                  Approve Decision
                </Button>
              </Box>
            </VStack>
          ) : (
            <Text>No decision selected</Text>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

// Decision log entry component
const DecisionLogItem = ({ 
  entry, 
  onClick 
}: { 
  entry: DecisionLogEntry; 
  onClick: () => void;
}) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Box 
      p={3} 
      borderWidth={1} 
      borderRadius="md" 
      borderColor={borderColor}
      bg={bgColor}
      mb={2}
      cursor="pointer"
      _hover={{ bg: useColorModeValue('gray.50', 'gray.600') }}
      onClick={onClick}
    >
      <Flex justify="space-between" align="center" mb={1}>
        <Text fontSize="sm" fontWeight="medium">{entry.action}</Text>
        <Badge 
          colorScheme={entry.confidence > 0.85 ? "green" : entry.confidence > 0.7 ? "yellow" : "red"}
          fontSize="xs"
        >
          {Math.round(entry.confidence * 100)}%
        </Badge>
      </Flex>
      <Text fontSize="xs" color="gray.500">
        {new Date(entry.timestamp).toLocaleString()}
      </Text>
    </Box>
  );
};

// Main AccountabilityPanel component
const AccountabilityPanel = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDecision, setSelectedDecision] = useState<DecisionLogEntry | null>(null);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const handleDecisionClick = (decision: DecisionLogEntry) => {
    setSelectedDecision(decision);
    onOpen();
  };
  
  return (
    <Box 
      bg={bgColor} 
      p={5} 
      borderRadius="lg" 
      borderWidth={1} 
      borderColor={borderColor}
      mb={6}
      boxShadow="sm"
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md">Agent Accountability</Heading>
        <Button size="sm" colorScheme="blue" variant="outline">
          View All
        </Button>
      </Flex>
      
      <Text fontSize="sm" color="gray.500" mb={3}>
        Recent agent decisions and actions
      </Text>
      
      {/* Decision log list */}
      {mockDecisionLog.map(entry => (
        <DecisionLogItem 
          key={entry.id} 
          entry={entry} 
          onClick={() => handleDecisionClick(entry)} 
        />
      ))}
      
      {/* Decision detail modal */}
      <DecisionDetailModal 
        isOpen={isOpen} 
        onClose={onClose} 
        decision={selectedDecision} 
      />
    </Box>
  );
};

export default AccountabilityPanel;
