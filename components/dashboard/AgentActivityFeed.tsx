/**
 * Agent Activity Feed - Real-time visualization of AI agent actions
 * Shows every action Max takes with timestamps, outcomes, and filters
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  Card,
  CardBody,
  Select,
  Switch,
  FormControl,
  FormLabel,
  Spinner,
  Tooltip,
  Button,
  useColorModeValue
} from '@chakra-ui/react';
import {
  Activity,
  Mail,
  Calendar,
  Phone,
  User,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  RefreshCw
} from 'lucide-react';
import { agentBehaviorTracker, AgentBehaviorEvent, AgentActionType, AgentVertical } from '../../lib/services/agent/agentBehaviorTracker';

interface AgentActivityFeedProps {
  maxEvents?: number;
  showFilters?: boolean;
  autoRefresh?: boolean;
  className?: string;
}

const actionIcons: Record<AgentActionType, any> = {
  lead_created: User,
  lead_updated: User,
  email_sent: Mail,
  call_scheduled: Phone,
  follow_up_created: Clock,
  meeting_booked: Calendar,
  deal_progressed: TrendingUp,
  handoff_triggered: AlertTriangle,
  decision_made: CheckCircle,
  workflow_started: Activity,
  workflow_completed: CheckCircle,
  error_handled: AlertTriangle,
  fallback_activated: RefreshCw
};

const actionColors: Record<AgentActionType, string> = {
  lead_created: 'blue',
  lead_updated: 'cyan',
  email_sent: 'green',
  call_scheduled: 'purple',
  follow_up_created: 'orange',
  meeting_booked: 'teal',
  deal_progressed: 'green',
  handoff_triggered: 'red',
  decision_made: 'blue',
  workflow_started: 'purple',
  workflow_completed: 'green',
  error_handled: 'red',
  fallback_activated: 'yellow'
};

const verticalEmojis: Record<AgentVertical, string> = {
  realEstate: '🏠',
  mortgage: '🏦',
  msp: '💻',
  consulting: '💼',
  solar: '☀️',
  hvac: '🌡️'
};

export const AgentActivityFeed: React.FC<AgentActivityFeedProps> = ({
  maxEvents = 50,
  showFilters = true,
  autoRefresh = true,
  className
}) => {
  const [events, setEvents] = useState<AgentBehaviorEvent[]>([]);
  const [isLive, setIsLive] = useState(autoRefresh);
  const [filterAgent, setFilterAgent] = useState<string>('all');
  const [filterVertical, setFilterVertical] = useState<AgentVertical | 'all'>('all');
  const [filterAction, setFilterAction] = useState<AgentActionType | 'all'>('all');
  const [showOnlySuccess, setShowOnlySuccess] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Load initial events and set up real-time updates
  useEffect(() => {
    const loadEvents = () => {
      const recentEvents = agentBehaviorTracker.getRecentEvents(maxEvents);
      setEvents(recentEvents);
    };

    loadEvents();

    if (isLive) {
      const handleNewEvent = (event: AgentBehaviorEvent) => {
        setEvents(prev => [event, ...prev.slice(0, maxEvents - 1)]);
      };

      agentBehaviorTracker.on('behaviorEvent', handleNewEvent);
      return () => {
        agentBehaviorTracker.off('behaviorEvent', handleNewEvent);
      };
    }
  }, [isLive, maxEvents]);

  // Filter events based on current filters
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (filterAgent !== 'all' && event.agentName !== filterAgent) return false;
      if (filterVertical !== 'all' && event.vertical !== filterVertical) return false;
      if (filterAction !== 'all' && event.actionType !== filterAction) return false;
      if (showOnlySuccess && event.details.outcome !== 'success') return false;
      return true;
    });
  }, [events, filterAgent, filterVertical, filterAction, showOnlySuccess]);

  // Get unique agents for filter dropdown
  const uniqueAgents = useMemo(() => {
    const agents = new Set(events.map(e => e.agentName));
    return Array.from(agents);
  }, [events]);

  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(timestamp);
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return '';
    if (duration < 1000) return `${duration}ms`;
    return `${(duration / 1000).toFixed(1)}s`;
  };

  const getOutcomeBadge = (outcome?: string, confidence?: number) => {
    if (!outcome) return null;
    
    const color = outcome === 'success' ? 'green' : outcome === 'failure' ? 'red' : 'yellow';
    const label = outcome === 'success' ? '✓' : outcome === 'failure' ? '✗' : '⏳';
    
    return (
      <Badge colorScheme={color} size="sm">
        {label} {confidence && `${Math.round(confidence * 100)}%`}
      </Badge>
    );
  };

  const refreshFeed = () => {
    const recentEvents = agentBehaviorTracker.getRecentEvents(maxEvents);
    setEvents(recentEvents);
  };

  return (
    <Card className={className} bg={bgColor} borderColor={borderColor}>
      <CardBody>
        <VStack spacing={4} align="stretch">
          {/* Header */}
          <HStack justify="space-between">
            <HStack>
              <Icon as={Activity} color="blue.500" />
              <Text fontSize="lg" fontWeight="bold">
                Agent Activity Feed
              </Text>
              {isLive && (
                <Badge colorScheme="green" variant="solid">
                  LIVE
                </Badge>
              )}
            </HStack>
            
            <HStack>
              <Tooltip label="Refresh feed">
                <Button size="sm" variant="ghost" onClick={refreshFeed}>
                  <Icon as={RefreshCw} />
                </Button>
              </Tooltip>
            </HStack>
          </HStack>

          {/* Filters */}
          {showFilters && (
            <Box p={3} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
              <HStack spacing={4} wrap="wrap">
                <FormControl maxW="150px">
                  <FormLabel fontSize="sm">Agent</FormLabel>
                  <Select size="sm" value={filterAgent} onChange={(e) => setFilterAgent(e.target.value)}>
                    <option value="all">All Agents</option>
                    {uniqueAgents.map(agent => (
                      <option key={agent} value={agent}>{agent}</option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl maxW="150px">
                  <FormLabel fontSize="sm">Vertical</FormLabel>
                  <Select size="sm" value={filterVertical} onChange={(e) => setFilterVertical(e.target.value as any)}>
                    <option value="all">All Verticals</option>
                    <option value="realEstate">🏠 Real Estate</option>
                    <option value="mortgage">🏦 Mortgage</option>
                    <option value="msp">💻 MSP</option>
                    <option value="consulting">💼 Consulting</option>
                    <option value="solar">☀️ Solar</option>
                    <option value="hvac">🌡️ HVAC</option>
                  </Select>
                </FormControl>

                <FormControl maxW="150px">
                  <FormLabel fontSize="sm">Action</FormLabel>
                  <Select size="sm" value={filterAction} onChange={(e) => setFilterAction(e.target.value as any)}>
                    <option value="all">All Actions</option>
                    <option value="lead_created">Lead Created</option>
                    <option value="email_sent">Email Sent</option>
                    <option value="meeting_booked">Meeting Booked</option>
                    <option value="deal_progressed">Deal Progressed</option>
                    <option value="handoff_triggered">Handoff</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm">Live Updates</FormLabel>
                  <Switch
                    isChecked={isLive}
                    onChange={(e) => setIsLive(e.target.checked)}
                    colorScheme="green"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm">Success Only</FormLabel>
                  <Switch
                    isChecked={showOnlySuccess}
                    onChange={(e) => setShowOnlySuccess(e.target.checked)}
                    colorScheme="blue"
                  />
                </FormControl>
              </HStack>
            </Box>
          )}

          {/* Activity Feed */}
          <VStack spacing={2} align="stretch" maxH="500px" overflowY="auto">
            {filteredEvents.length === 0 ? (
              <Box textAlign="center" py={8} color="gray.500">
                <Icon as={Activity} size="2xl" mb={2} />
                <Text>No agent activities yet</Text>
                <Text fontSize="sm">Agent actions will appear here in real-time</Text>
              </Box>
            ) : (
              filteredEvents.map((event) => {
                const ActionIcon = actionIcons[event.actionType];
                const actionColor = actionColors[event.actionType];
                
                return (
                  <Card
                    key={event.id}
                    size="sm"
                    variant="outline"
                    borderLeftWidth="4px"
                    borderLeftColor={`${actionColor}.500`}
                    _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                  >
                    <CardBody py={3}>
                      <HStack spacing={3} align="start">
                        <Icon
                          as={ActionIcon}
                          color={`${actionColor}.500`}
                          mt={1}
                        />
                        
                        <VStack align="start" spacing={1} flex={1}>
                          <HStack spacing={2} wrap="wrap">
                            <Text fontSize="sm" fontWeight="medium">
                              {verticalEmojis[event.vertical]} {event.agentName}
                            </Text>
                            <Badge colorScheme={actionColor} size="sm">
                              {event.actionType.replace('_', ' ')}
                            </Badge>
                            {getOutcomeBadge(event.details.outcome, event.confidence)}
                            <Text fontSize="xs" color="gray.500">
                              {formatTime(event.timestamp)}
                            </Text>
                            {event.duration && (
                              <Text fontSize="xs" color="gray.500">
                                {formatDuration(event.duration)}
                              </Text>
                            )}
                          </HStack>
                          
                          <Text fontSize="sm" color="gray.700">
                            {event.description}
                          </Text>
                          
                          {event.nextAction && (
                            <Text fontSize="xs" color="blue.600">
                              Next: {event.nextAction}
                            </Text>
                          )}
                        </VStack>
                      </HStack>
                    </CardBody>
                  </Card>
                );
              })
            )}
          </VStack>

          {/* Footer Stats */}
          <HStack justify="space-between" pt={2} borderTop="1px" borderColor={borderColor}>
            <Text fontSize="sm" color="gray.600">
              Showing {filteredEvents.length} of {events.length} events
            </Text>
            {isLive && (
              <HStack>
                <Spinner size="xs" color="green.500" />
                <Text fontSize="sm" color="green.600">
                  Live monitoring
                </Text>
              </HStack>
            )}
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
};
