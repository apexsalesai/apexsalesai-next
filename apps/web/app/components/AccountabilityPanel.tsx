import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useColorModeValue,
  Tooltip,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Select,
  Textarea,
} from '@chakra-ui/react';
import { 
  InfoIcon, 
  CheckIcon, 
  CloseIcon, 
  RepeatIcon, 
  ChevronDownIcon, 
  EditIcon,
  WarningIcon
} from '@chakra-ui/icons';

// Sample decision data (in production, this would come from the API)
const sampleDecisions = [
  {
    id: 'd1',
    timestamp: '2025-06-24T09:15:00',
    action: 'Lead Qualification',
    decision: 'Marked as high-intent buyer',
    confidence: 0.91,
    reason: 'Responded to all qualification questions, has mortgage pre-approval, looking to purchase within 30 days',
    status: 'executed',
    override: false,
    high_stakes: false,
  },
  {
    id: 'd2',
    timestamp: '2025-06-24T09:30:00',
    action: 'Showing Scheduler',
    decision: 'Booked showing for 123 Main St',
    confidence: 0.87,
    reason: 'Property matches buyer criteria (3bd, 2ba, <$450k) and buyer is available on suggested date',
    status: 'executed',
    override: false,
    high_stakes: false,
  },
  {
    id: 'd3',
    timestamp: '2025-06-24T10:05:00',
    action: 'Document Request',
    decision: 'Requested proof of funds',
    confidence: 0.95,
    reason: 'Standard procedure for high-intent buyers before showing luxury properties',
    status: 'pending',
    override: false,
    high_stakes: true,
  },
  {
    id: 'd4',
    timestamp: '2025-06-23T16:42:00',
    action: 'Lead Re-engagement',
    decision: 'Sent SMS + email combo',
    confidence: 0.78,
    reason: 'Lead has been inactive for 3 days after initial interest',
    status: 'executed',
    override: false,
    high_stakes: false,
  },
  {
    id: 'd5',
    timestamp: '2025-06-23T14:15:00',
    action: 'Price Drop Suggestion',
    decision: 'Recommended 5% price reduction',
    confidence: 0.82,
    reason: 'Listing has been active for 45 days with declining showing requests',
    status: 'overridden',
    override: true,
    high_stakes: true,
    override_reason: 'Seller not ready to reduce price, wants to wait 2 more weeks',
  },
];

export const AccountabilityPanel = () => {
  const [decisions, setDecisions] = useState(sampleDecisions);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDecision, setSelectedDecision] = useState<any>(null);
  const [overrideReason, setOverrideReason] = useState('');
  const [overrideAction, setOverrideAction] = useState('');
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const headerBg = useColorModeValue('gray.50', 'gray.700');
  
  // Function to handle opening the override modal
  const handleOverrideClick = (decision: any) => {
    setSelectedDecision(decision);
    setOverrideReason('');
    setOverrideAction('cancel'); // Default action
    onOpen();
  };
  
  // Function to handle submitting the override
  const handleOverrideSubmit = () => {
    const updatedDecisions = decisions.map(d => {
      if (d.id === selectedDecision.id) {
        return {
          ...d,
          status: 'overridden',
          override: true,
          override_reason: overrideReason,
        };
      }
      return d;
    });
    
    setDecisions(updatedDecisions);
    onClose();
  };
  
  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'executed':
        return <Badge colorScheme="green">Executed</Badge>;
      case 'pending':
        return <Badge colorScheme="blue">Pending</Badge>;
      case 'overridden':
        return <Badge colorScheme="orange">Overridden</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  // Function to get confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'green.500';
    if (confidence >= 0.8) return 'blue.500';
    if (confidence >= 0.7) return 'yellow.500';
    return 'red.500';
  };

  return (
    <Box
      p={5}
      borderRadius="lg"
      bg={bgColor}
      boxShadow="md"
      border="1px solid"
      borderColor={borderColor}
      mb={6}
    >
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="md">Agent Accountability & Override</Heading>
        <Tooltip label="View all agent decisions and take action when needed">
          <InfoIcon color="gray.500" />
        </Tooltip>
      </Flex>
      
      {/* High-stakes pending decisions alert */}
      {decisions.some(d => d.high_stakes && d.status === 'pending') && (
        <Alert status="warning" mb={4} borderRadius="md">
          <AlertIcon />
          <Text>High-stakes decisions pending review</Text>
        </Alert>
      )}
      
      {/* Decision log table */}
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead bg={headerBg}>
            <Tr>
              <Th>Time</Th>
              <Th>Action</Th>
              <Th>Decision</Th>
              <Th>Confidence</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {decisions.map((decision) => (
              <Tr key={decision.id}>
                <Td whiteSpace="nowrap">
                  {new Date(decision.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Td>
                <Td>
                  <Flex alignItems="center">
                    {decision.high_stakes && (
                      <Tooltip label="High-stakes decision">
                        <WarningIcon color="orange.500" mr={1} boxSize={3} />
                      </Tooltip>
                    )}
                    {decision.action}
                  </Flex>
                </Td>
                <Td>
                  <Tooltip label={decision.reason}>
                    <Text noOfLines={1}>{decision.decision}</Text>
                  </Tooltip>
                </Td>
                <Td>
                  <Flex alignItems="center">
                    <Box
                      w="12px"
                      h="12px"
                      borderRadius="full"
                      bg={getConfidenceColor(decision.confidence)}
                      mr={2}
                    />
                    <Text>{Math.round(decision.confidence * 100)}%</Text>
                  </Flex>
                </Td>
                <Td>{getStatusBadge(decision.status)}</Td>
                <Td>
                  {decision.status === 'pending' ? (
                    <Flex>
                      <Tooltip label="Approve">
                        <IconButton
                          aria-label="Approve"
                          icon={<CheckIcon />}
                          size="sm"
                          colorScheme="green"
                          variant="ghost"
                          mr={1}
                        />
                      </Tooltip>
                      <Tooltip label="Override">
                        <IconButton
                          aria-label="Override"
                          icon={<CloseIcon />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleOverrideClick(decision)}
                        />
                      </Tooltip>
                    </Flex>
                  ) : (
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="Options"
                        icon={<ChevronDownIcon />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList fontSize="sm">
                        <MenuItem icon={<InfoIcon />}>View Details</MenuItem>
                        {decision.status !== 'overridden' && (
                          <MenuItem 
                            icon={<EditIcon />}
                            onClick={() => handleOverrideClick(decision)}
                          >
                            Override
                          </MenuItem>
                        )}
                        <MenuItem icon={<RepeatIcon />}>Retry</MenuItem>
                      </MenuList>
                    </Menu>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      
      <Flex justifyContent="space-between" mt={4}>
        <Text fontSize="xs" color="gray.500">
          Showing last 5 decisions • All decisions are logged and auditable
        </Text>
        <Button size="xs" variant="outline">
          View All Decisions
        </Button>
      </Flex>
      
      {/* Override Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Override Agent Decision</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedDecision && (
              <>
                <Box mb={4}>
                  <Text fontWeight="bold">Decision:</Text>
                  <Text>{selectedDecision.decision}</Text>
                </Box>
                
                <Box mb={4}>
                  <Text fontWeight="bold">Agent's Reasoning:</Text>
                  <Text>{selectedDecision.reason}</Text>
                </Box>
                
                <Divider my={4} />
                
                <Box mb={4}>
                  <Text fontWeight="bold" mb={2}>Override Action:</Text>
                  <Select 
                    value={overrideAction}
                    onChange={(e) => setOverrideAction(e.target.value)}
                  >
                    <option value="cancel">Cancel this action</option>
                    <option value="modify">Modify and execute</option>
                    <option value="delay">Delay for later review</option>
                  </Select>
                </Box>
                
                <Box mb={4}>
                  <Text fontWeight="bold" mb={2}>Override Reason:</Text>
                  <Textarea
                    placeholder="Explain why you're overriding this decision..."
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                  />
                </Box>
              </>
            )}
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="red" 
              onClick={handleOverrideSubmit}
              isDisabled={!overrideReason}
            >
              Confirm Override
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AccountabilityPanel;
