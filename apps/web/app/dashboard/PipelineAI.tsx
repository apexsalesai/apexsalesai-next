'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Button,
  Badge,
  Progress,
  Stack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Tooltip,
  Icon,
  Divider,
  HStack,
  VStack,
  Circle,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Skeleton
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

// Animated components using Framer Motion
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionCard = motion(Card);

// Premium Pipeline AI dashboard component
const PipelineAI = () => {
  // Theme colors
  const bgCard = useColorModeValue('white', 'gray.700');
  const bgInsight = useColorModeValue('blue.50', 'gray.800');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const accentColor = useColorModeValue('blue.500', 'blue.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // State for loading animations
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedInsight, setSelectedInsight] = useState('');
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  // Executive summary data
  const executiveSummary = {
    title: "AI-Driven Pipeline Insights",
    summary: "Your pipeline health is strong with a 12% increase in total value this quarter. The AI has identified 3 high-value opportunities that need attention and 2 deals at risk that require immediate action.",
    recommendation: "Focus on the TechGiant deal which has a 78% probability to close this month, potentially adding $85K to your Q3 revenue."
  };
  
  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };
  
  const handleInsightClick = (insight: string) => {
    setSelectedInsight(insight);
    onOpen();
  };
  
  return (
    <Box p={4}>
      {/* Executive Summary - Premium "Wow" Element */}
      <MotionCard 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        mb={6} 
        bg={accentColor} 
        color="white"
        borderRadius="xl"
        overflow="hidden"
        boxShadow="xl"
      >
        <CardBody>
          <Flex direction={{ base: 'column', md: 'row' }} alignItems="center">
            <Circle size="60px" bg="white" color={accentColor} mr={{ base: 0, md: 6 }} mb={{ base: 4, md: 0 }}>
              <Icon boxSize={8} viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"
                />
              </Icon>
            </Circle>
            <Box flex="1">
              <Heading as="h3" size="md" mb={2}>{executiveSummary.title}</Heading>
              <Text mb={3}>{executiveSummary.summary}</Text>
              <HStack>
                <Icon viewBox="0 0 24 24" boxSize={5}>
                  <path
                    fill="currentColor"
                    d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M7,10L12,15L17,10H7Z"
                  />
                </Icon>
                <Text fontWeight="bold">AI Recommendation:</Text>
                <Text>{executiveSummary.recommendation}</Text>
              </HStack>
            </Box>
          </Flex>
        </CardBody>
      </MotionCard>
      
      {/* Dashboard Header with Timeframe Selector */}
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading as="h2" size="lg">Pipeline AI Dashboard</Heading>
        <HStack spacing={2}>
          <Button 
            variant={selectedTimeframe === '7d' ? 'solid' : 'outline'} 
            size="sm"
            colorScheme="blue"
            onClick={() => setSelectedTimeframe('7d')}
          >
            7 Days
          </Button>
          <Button 
            variant={selectedTimeframe === '30d' ? 'solid' : 'outline'} 
            size="sm"
            colorScheme="blue"
            onClick={() => setSelectedTimeframe('30d')}
          >
            30 Days
          </Button>
          <Button 
            variant={selectedTimeframe === '90d' ? 'solid' : 'outline'} 
            size="sm"
            colorScheme="blue"
            onClick={() => setSelectedTimeframe('90d')}
          >
            Quarter
          </Button>
          <Tooltip label="Refresh dashboard data" placement="top">
            <Button size="sm" colorScheme="blue" leftIcon={<Icon viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"
              />
            </Icon>}>
              Refresh
            </Button>
          </Tooltip>
        </HStack>
      </Flex>

      {/* KPI Cards with Animation */}
      <MotionFlex
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        mb={6}
      >
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} width="100%">
          {[
            { 
              title: 'Pipeline Value', 
              value: '$1.2M', 
              change: '+12%', 
              trend: 'up',
              icon: (
                <path
                  fill="currentColor"
                  d="M3,22V8H7V22H3M10,22V2H14V22H10M17,22V14H21V22H17Z"
                />
              ),
              detail: 'Based on 42 active deals',
              forecast: 'Projected to reach $1.5M by EOQ'
            },
            { 
              title: 'Win Rate', 
              value: '32%', 
              change: '+5%', 
              trend: 'up',
              icon: (
                <path
                  fill="currentColor"
                  d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,17V16H9V14H13V13H10A1,1 0 0,1 9,12V9A1,1 0 0,1 10,8H11V7H13V8H15V10H11V11H14A1,1 0 0,1 15,12V15A1,1 0 0,1 14,16H13V17H11Z"
                />
              ),
              detail: 'Up from 27% last quarter',
              forecast: 'AI suggests 35% possible with follow-up optimization'
            },
            { 
              title: 'Avg Deal Size', 
              value: '$45K', 
              change: '-3%', 
              trend: 'down',
              icon: (
                <path
                  fill="currentColor"
                  d="M21,18V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V6H12C10.89,6 10,6.9 10,8V16A2,2 0 0,0 12,18M12,16H22V8H12M16,13.5A1.5,1.5 0 0,1 14.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,12A1.5,1.5 0 0,1 16,13.5Z"
                />
              ),
              detail: 'Focus on mid-market causing shift',
              forecast: 'Opportunity to increase with enterprise upsells'
            },
            { 
              title: 'Sales Velocity', 
              value: '28 days', 
              change: '-2 days', 
              trend: 'up',
              icon: (
                <path
                  fill="currentColor"
                  d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"
                />
              ),
              detail: 'Faster deal closure than industry avg',
              forecast: 'AI suggests 25 days possible with process optimization'
            },
          ].map((kpi, i) => (
            <MotionCard 
              key={i} 
              variants={itemVariants}
              bg={bgCard}
              borderRadius="lg"
              boxShadow="md"
              _hover={{ 
                transform: 'translateY(-5px)', 
                transition: 'transform 0.3s ease',
                boxShadow: 'lg'
              }}
              overflow="hidden"
            >
              <CardHeader pb={0}>
                <Flex justifyContent="space-between" alignItems="center">
                  <HStack>
                    <Circle size="32px" bg={kpi.trend === 'up' ? 'green.100' : 'red.100'} color={kpi.trend === 'up' ? 'green.500' : 'red.500'}>
                      <Icon viewBox="0 0 24 24">{kpi.icon}</Icon>
                    </Circle>
                    <Text fontSize="sm" fontWeight="medium" color={textSecondary}>{kpi.title}</Text>
                  </HStack>
                  <Tooltip label={kpi.forecast} placement="top">
                    <Icon viewBox="0 0 24 24" color={accentColor} cursor="pointer">
                      <path
                        fill="currentColor"
                        d="M13,9H11V7H13V9M13,17H11V11H13V17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
                      />
                    </Icon>
                  </Tooltip>
                </Flex>
              </CardHeader>
              <CardBody>
                <Stack spacing={1}>
                  <Flex alignItems="baseline">
                    <Text fontSize="2xl" fontWeight="bold">{kpi.value}</Text>
                    <Badge 
                      ml={2} 
                      colorScheme={kpi.trend === 'up' ? 'green' : 'red'} 
                      variant="subtle"
                      px={2}
                      py={0.5}
                      borderRadius="full"
                    >
                      <HStack spacing={1} alignItems="center">
                        <Icon viewBox="0 0 24 24" boxSize={3}>
                          <path
                            fill="currentColor"
                            d={kpi.trend === 'up' 
                              ? "M7,15L12,10L17,15H7Z" 
                              : "M7,10L12,15L17,10H7Z"}
                          />
                        </Icon>
                        <Text>{kpi.change}</Text>
                      </HStack>
                    </Badge>
                  </Flex>
                  <Text fontSize="xs" color={textSecondary}>{kpi.detail}</Text>
                </Stack>
              </CardBody>
            </MotionCard>
          ))}
        </SimpleGrid>
      </MotionFlex>


      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6} mb={6}>
        {/* Pipeline Stages */}
        <Card gridColumn={{ lg: 'span 2' }} bg={bgCard}>
          <CardBody>
            <Heading as="h3" size="md" mb={4}>Pipeline by Stage</Heading>
            <Stack spacing={4}>
              {[
                { name: 'Qualification', value: 65, count: 42, amount: '$320K' },
                { name: 'Discovery', value: 48, count: 28, amount: '$410K' },
                { name: 'Proposal', value: 30, count: 15, amount: '$280K' },
                { name: 'Negotiation', value: 18, count: 8, amount: '$190K' },
              ].map((stage, i) => (
                <Box key={i}>
                  <Flex justifyContent="space-between" mb={1}>
                    <Text fontSize="sm">{stage.name}</Text>
                    <Text fontSize="sm" color={textSecondary}>{stage.count} deals · {stage.amount}</Text>
                  </Flex>
                  <Progress value={stage.value} size="sm" colorScheme="blue" />
                </Box>
              ))}
            </Stack>
          </CardBody>
        </Card>

        {/* AI Insights - Enhanced Premium Version */}
        <Card bg={bgCard} borderRadius="lg" boxShadow="md" overflow="hidden">
          <CardHeader bg={accentColor} py={3}>
            <Flex alignItems="center" justifyContent="space-between">
              <HStack>
                <Icon viewBox="0 0 24 24" color="white" boxSize={5}>
                  <path
                    fill="currentColor"
                    d="M13,3V9H21V3M13,21H21V11H13M3,21H11V15H3M3,13H11V3H3V13Z"
                  />
                </Icon>
                <Heading as="h3" size="md" color="white">AI Insights</Heading>
              </HStack>
              <Badge colorScheme="green" variant="solid">4 New</Badge>
            </Flex>
          </CardHeader>
          <CardBody>
            <Stack spacing={4}>
              {[
                {
                  type: 'opportunity',
                  text: 'Deals in "Proposal" stage are 15% more likely to close this quarter compared to last',
                  action: 'View Deals',
                  icon: 'M16,9H13V14.5A2.5,2.5 0 0,1 10.5,17A2.5,2.5 0 0,1 8,14.5A2.5,2.5 0 0,1 10.5,12C11.07,12 11.58,12.19 12,12.5V7H16V9M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z'
                },
                {
                  type: 'action',
                  text: 'Follow-up emails sent within 24hrs increase response rate by 35%',
                  action: 'Schedule Follow-ups',
                  icon: 'M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z'
                },
                {
                  type: 'risk',
                  text: '3 deals need urgent attention due to lack of activity',
                  action: 'Review Deals',
                  icon: 'M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z'
                },
                {
                  type: 'performance',
                  text: 'Team performance is trending 8% above target',
                  action: 'View Analytics',
                  icon: 'M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z'
                },
              ].map((insight, i) => (
                <MotionCard 
                  key={i} 
                  variants={itemVariants}
                  p={0} 
                  bg={bgInsight} 
                  borderRadius="md" 
                  fontSize="sm"
                  overflow="hidden"
                  cursor="pointer"
                  onClick={() => handleInsightClick(insight.text)}
                  _hover={{ boxShadow: 'md', transform: 'translateY(-2px)', transition: 'all 0.2s ease' }}
                >
                  <Flex p={3}>
                    <Circle 
                      size="36px" 
                      bg={insight.type === 'risk' ? 'red.100' : insight.type === 'opportunity' ? 'green.100' : 'blue.100'} 
                      color={insight.type === 'risk' ? 'red.500' : insight.type === 'opportunity' ? 'green.500' : 'blue.500'}
                      mr={3}
                      flexShrink={0}
                    >
                      <Icon viewBox="0 0 24 24">
                        <path fill="currentColor" d={insight.icon} />
                      </Icon>
                    </Circle>
                    <Box>
                      <Text mb={2}>{insight.text}</Text>
                      <Button 
                        size="xs" 
                        colorScheme={insight.type === 'risk' ? 'red' : insight.type === 'opportunity' ? 'green' : 'blue'}
                        variant="outline"
                        rightIcon={<Icon viewBox="0 0 24 24" boxSize={3}>
                          <path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                        </Icon>}
                      >
                        {insight.action}
                      </Button>
                    </Box>
                  </Flex>
                </MotionCard>
              ))}
            </Stack>
          </CardBody>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Deal Forecasting - Premium Version */}
        <MotionCard 
          variants={itemVariants}
          bg={bgCard}
          borderRadius="lg"
          boxShadow="md"
          overflow="hidden"
        >
          <CardHeader bg={accentColor} py={3}>
            <Flex alignItems="center" justifyContent="space-between">
              <HStack>
                <Icon viewBox="0 0 24 24" color="white" boxSize={5}>
                  <path
                    fill="currentColor"
                    d="M7,13H21V11H7M7,19H21V17H7M7,7H21V5H7M2,11H5V13H2M2,5H5V7H2M2,17H5V19H2V17Z"
                  />
                </Icon>
                <Heading as="h3" size="md" color="white">Deal Forecasting</Heading>
              </HStack>
              <Badge colorScheme="green" variant="solid">
                <HStack spacing={1}>
                  <Icon viewBox="0 0 24 24" boxSize={3}>
                    <path fill="currentColor" d="M3,5H9V11H3V5M5,7V9H7V7H5M11,7H21V9H11V7M11,15H21V17H11V15M5,20L1.5,16.5L2.91,15.09L5,17.17L9.59,12.59L11,14L5,20Z" />
                  </Icon>
                  <Text>AI Powered</Text>
                </HStack>
              </Badge>
            </Flex>
          </CardHeader>
          <CardBody>
            <Tabs variant="soft-rounded" colorScheme="blue">
              <TabList mb={4} overflowX="auto" css={{ scrollbarWidth: 'none' }}>
                <Tab _selected={{ color: 'white', bg: 'green.500' }}>
                  <HStack>
                    <Icon viewBox="0 0 24 24" boxSize={4}>
                      <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,17V16H9V14H13V13H10A1,1 0 0,1 9,12V9A1,1 0 0,1 10,8H11V7H13V8H15V10H11V11H14A1,1 0 0,1 15,12V15A1,1 0 0,1 14,16H13V17H11Z" />
                    </Icon>
                    <Text>Likely to Close</Text>
                  </HStack>
                </Tab>
                <Tab _selected={{ color: 'white', bg: 'orange.500' }}>
                  <HStack>
                    <Icon viewBox="0 0 24 24" boxSize={4}>
                      <path fill="currentColor" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                    </Icon>
                    <Text>At Risk</Text>
                  </HStack>
                </Tab>
                <Tab _selected={{ color: 'white', bg: 'red.500' }}>
                  <HStack>
                    <Icon viewBox="0 0 24 24" boxSize={4}>
                      <path fill="currentColor" d="M12,2C17.52,2 22,6.48 22,12C22,17.52 17.52,22 12,22C6.48,22 2,17.52 2,12C2,6.48 6.48,2 12,2M12,4C7.58,4 4,7.58 4,12C4,16.42 7.58,20 12,20C16.42,20 20,16.42 20,12C20,7.58 16.42,4 12,4M15,16H13V14H15V16M15,12H13V7H15V12Z" />
                    </Icon>
                    <Text>Stalled</Text>
                  </HStack>
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel p={0}>
                  <Stack spacing={3}>
                    {[
                      { 
                        name: 'Acme Corp - Enterprise Plan', 
                        value: '$120K', 
                        probability: '85%',
                        nextStep: 'Contract review',
                        daysToClose: 14,
                        contact: 'Sarah Johnson',
                        lastActivity: 'Demo call (2 days ago)'
                      },
                      { 
                        name: 'TechGiant - API Integration', 
                        value: '$85K', 
                        probability: '78%',
                        nextStep: 'Technical assessment',
                        daysToClose: 21,
                        contact: 'Michael Chen',
                        lastActivity: 'Email follow-up (1 day ago)'
                      },
                      { 
                        name: 'StartupXYZ - Annual Subscription', 
                        value: '$42K', 
                        probability: '92%',
                        nextStep: 'Final proposal',
                        daysToClose: 7,
                        contact: 'Alex Rivera',
                        lastActivity: 'Pricing negotiation (today)'
                      },
                    ].map((deal, i) => (
                      <MotionCard 
                        key={i} 
                        variants={itemVariants}
                        p={0} 
                        borderRadius="md"
                        overflow="hidden"
                        boxShadow="sm"
                        borderLeft="4px solid"
                        borderColor="green.500"
                        _hover={{ 
                          transform: 'translateY(-2px)', 
                          boxShadow: 'md',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Box p={3}>
                          <Flex justifyContent="space-between" alignItems="center" mb={2}>
                            <Heading size="sm">{deal.name}</Heading>
                            <HStack>
                              <Stat size="sm">
                                <StatNumber fontSize="md">{deal.value}</StatNumber>
                              </Stat>
                              <Badge colorScheme="green" fontSize="sm" borderRadius="full" px={2}>
                                {deal.probability}
                              </Badge>
                            </HStack>
                          </Flex>
                          <Divider my={2} />
                          <SimpleGrid columns={2} spacing={2} fontSize="xs">
                            <HStack>
                              <Text fontWeight="bold" color={textSecondary}>Next:</Text>
                              <Text>{deal.nextStep}</Text>
                            </HStack>
                            <HStack>
                              <Text fontWeight="bold" color={textSecondary}>Timeline:</Text>
                              <Text>{deal.daysToClose} days</Text>
                            </HStack>
                            <HStack>
                              <Text fontWeight="bold" color={textSecondary}>Contact:</Text>
                              <Text>{deal.contact}</Text>
                            </HStack>
                            <HStack>
                              <Text fontWeight="bold" color={textSecondary}>Last Activity:</Text>
                              <Text>{deal.lastActivity}</Text>
                            </HStack>
                          </SimpleGrid>
                          <Flex justifyContent="flex-end" mt={2}>
                            <Button size="xs" colorScheme="blue" variant="ghost" rightIcon={<Icon viewBox="0 0 24 24" boxSize={3}>
                              <path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                            </Icon>}>
                              View Details
                            </Button>
                          </Flex>
                        </Box>
                      </MotionCard>
                    ))}
                  </Stack>
                </TabPanel>
                <TabPanel p={0}>
                  {/* At Risk Deals */}
                  <MotionCard 
                    variants={itemVariants}
                    p={0}
                    borderRadius="md"
                    overflow="hidden"
                    boxShadow="sm"
                    borderLeft="4px solid"
                    borderColor="orange.500"
                  >
                    <Box p={3}>
                      <Flex justifyContent="space-between" alignItems="center" mb={2}>
                        <Heading size="sm">MegaCorp - Platform License</Heading>
                        <HStack>
                          <Stat size="sm">
                            <StatNumber fontSize="md">$95K</StatNumber>
                          </Stat>
                          <Badge colorScheme="orange" fontSize="sm" borderRadius="full" px={2}>
                            62%
                          </Badge>
                        </HStack>
                      </Flex>
                      <Divider my={2} />
                      <SimpleGrid columns={2} spacing={2} fontSize="xs">
                        <HStack>
                          <Text fontWeight="bold" color={textSecondary}>Risk:</Text>
                          <Text color="orange.500">No activity for 14 days</Text>
                        </HStack>
                        <HStack>
                          <Text fontWeight="bold" color={textSecondary}>Timeline:</Text>
                          <Text>30 days</Text>
                        </HStack>
                        <HStack>
                          <Text fontWeight="bold" color={textSecondary}>Contact:</Text>
                          <Text>Robert Taylor</Text>
                        </HStack>
                        <HStack>
                          <Text fontWeight="bold" color={textSecondary}>AI Suggestion:</Text>
                          <Text color="orange.500">Schedule follow-up call</Text>
                        </HStack>
                      </SimpleGrid>
                      <Flex justifyContent="flex-end" mt={2}>
                        <Button size="xs" colorScheme="orange" rightIcon={<Icon viewBox="0 0 24 24" boxSize={3}>
                          <path fill="currentColor" d="M20,15.5C18.8,15.5 17.5,15.3 16.4,14.9C16.3,14.9 16.2,14.9 16.1,14.9C15.8,14.9 15.6,15 15.4,15.2L13.2,17.4C10.4,15.9 8,13.6 6.6,10.8L8.8,8.6C9.1,8.3 9.2,7.9 9,7.6C8.7,6.5 8.5,5.2 8.5,4C8.5,3.5 8,3 7.5,3H4C3.5,3 3,3.5 3,4C3,13.4 10.6,21 20,21C20.5,21 21,20.5 21,20V16.5C21,16 20.5,15.5 20,15.5M5,5H6.5C6.6,5.9 6.8,6.8 7,7.6L5.8,8.8C5.4,7.6 5.1,6.3 5,5M19,19C17.7,18.9 16.4,18.6 15.2,18.2L16.4,17C17.2,17.2 18.1,17.4 19,17.4V19Z" />
                        </Icon>}>
                          Call Now
                        </Button>
                      </Flex>
                    </Box>
                  </MotionCard>
                </TabPanel>
                <TabPanel p={0}>
                  {/* Stalled Deals */}
                  <MotionCard 
                    variants={itemVariants}
                    p={0}
                    borderRadius="md"
                    overflow="hidden"
                    boxShadow="sm"
                    borderLeft="4px solid"
                    borderColor="red.500"
                  >
                    <Box p={3}>
                      <Flex justifyContent="space-between" alignItems="center" mb={2}>
                        <Heading size="sm">Global Industries - Custom Solution</Heading>
                        <HStack>
                          <Stat size="sm">
                            <StatNumber fontSize="md">$150K</StatNumber>
                          </Stat>
                          <Badge colorScheme="red" fontSize="sm" borderRadius="full" px={2}>
                            35%
                          </Badge>
                        </HStack>
                      </Flex>
                      <Divider my={2} />
                      <SimpleGrid columns={2} spacing={2} fontSize="xs">
                        <HStack>
                          <Text fontWeight="bold" color={textSecondary}>Status:</Text>
                          <Text color="red.500">Stalled for 30+ days</Text>
                        </HStack>
                        <HStack>
                          <Text fontWeight="bold" color={textSecondary}>Blocker:</Text>
                          <Text>Budget approval</Text>
                        </HStack>
                        <HStack>
                          <Text fontWeight="bold" color={textSecondary}>Contact:</Text>
                          <Text>Jennifer Lee</Text>
                        </HStack>
                        <HStack>
                          <Text fontWeight="bold" color={textSecondary}>AI Suggestion:</Text>
                          <Text color="red.500">Offer phased implementation</Text>
                        </HStack>
                      </SimpleGrid>
                      <Flex justifyContent="space-between" mt={2}>
                        <Button size="xs" colorScheme="red" variant="outline">
                          Rescue Plan
                        </Button>
                        <Button size="xs" colorScheme="gray" variant="ghost">
                          Mark as Lost
                        </Button>
                      </Flex>
                    </Box>
                  </MotionCard>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </MotionCard>

        {/* AI Recommendations - Premium Version */}
        <MotionCard 
          variants={itemVariants}
          bg={bgCard}
          borderRadius="lg"
          boxShadow="md"
          overflow="hidden"
        >
          <CardHeader bg={accentColor} py={3}>
            <Flex alignItems="center" justifyContent="space-between">
              <HStack>
                <Icon viewBox="0 0 24 24" color="white" boxSize={5}>
                  <path
                    fill="currentColor"
                    d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"
                  />
                </Icon>
                <Heading as="h3" size="md" color="white">AI Revenue Recommendations</Heading>
              </HStack>
              <Badge colorScheme="purple" variant="solid">
                <HStack spacing={1}>
                  <Icon viewBox="0 0 24 24" boxSize={3}>
                    <path fill="currentColor" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9A3,3 0 0,1 15,12M12,11.26C11.5,11.26 11.26,11.5 11.26,12C11.26,12.5 11.5,12.74 12,12.74C12.5,12.74 12.74,12.5 12.74,12C12.74,11.5 12.5,11.26 12,11.26Z"
                  />
                  </Icon>
                  <Text>ROI Focused</Text>
                </HStack>
              </Badge>
            </Flex>
          </CardHeader>
          <CardBody>
            <Stack spacing={4}>
              <MotionCard
                variants={itemVariants}
                p={0}
                borderRadius="md"
                overflow="hidden"
                boxShadow="sm"
                borderLeft="4px solid"
                borderColor="purple.500"
                _hover={{ 
                  transform: 'translateY(-2px)', 
                  boxShadow: 'md',
                  transition: 'all 0.2s ease'
                }}
              >
                <Box p={4}>
                  <Flex alignItems="center" mb={3}>
                    <Circle size="40px" bg="purple.100" color="purple.500" mr={3}>
                      <Icon viewBox="0 0 24 24" boxSize={5}>
                        <path
                          fill="currentColor"
                          d="M21,5V7H17.5L15,5H12V7H9V9H12V11H9V13H12V15H9V17H12V19H15L17.5,17H21V19H22V5H21M19,15.5H16.5L15,17H12V15H15V13H12V11H15V9H12V7H15L16.5,8.5H19V15.5M8,19V5H5V19H8M2,19V5H1V19H2Z"
                        />
                      </Icon>
                    </Circle>
                    <Box>
                      <Heading size="sm">Optimize Follow-up Timing</Heading>
                      <Badge colorScheme="green" mt={1}>+23% Response Rate</Badge>
                    </Box>
                  </Flex>
                  <Text fontSize="sm" mb={3}>Your data shows optimal response rates when following up between 3-5 days after initial contact. Currently, 62% of your follow-ups fall outside this window.</Text>
                  <Flex justifyContent="space-between" alignItems="center">
                    <HStack>
                      <Icon viewBox="0 0 24 24" color="purple.500" boxSize={4}>
                        <path
                          fill="currentColor"
                          d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9A3,3 0 0,1 15,12M12,11.26C11.5,11.26 11.26,11.5 11.26,12C11.26,12.5 11.5,12.74 12,12.74C12.5,12.74 12.74,12.5 12.74,12C12.74,11.5 12.5,11.26 12,11.26Z"
                        />
                      </Icon>
                      <Text fontSize="xs" fontWeight="bold" color="purple.500">Estimated Annual Impact: $42,500</Text>
                    </HStack>
                    <Button size="sm" colorScheme="purple" rightIcon={<Icon viewBox="0 0 24 24" boxSize={4}>
                      <path fill="currentColor" d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z" />
                    </Icon>}>
                      Implement
                    </Button>
                  </Flex>
                </Box>
              </MotionCard>

              <MotionCard
                variants={itemVariants}
                p={0}
                borderRadius="md"
                overflow="hidden"
                boxShadow="sm"
                borderLeft="4px solid"
                borderColor="blue.500"
                _hover={{ 
                  transform: 'translateY(-2px)', 
                  boxShadow: 'md',
                  transition: 'all 0.2s ease'
                }}
              >
                <Box p={4}>
                  <Flex alignItems="center" mb={3}>
                    <Circle size="40px" bg="blue.100" color="blue.500" mr={3}>
                      <Icon viewBox="0 0 24 24" boxSize={5}>
                        <path
                          fill="currentColor"
                          d="M12,5A3.5,3.5 0 0,0 8.5,8.5A3.5,3.5 0 0,0 12,12A3.5,3.5 0 0,0 15.5,8.5A3.5,3.5 0 0,0 12,5M12,7A1.5,1.5 0 0,1 13.5,8.5A1.5,1.5 0 0,1 12,10A1.5,1.5 0 0,1 10.5,8.5A1.5,1.5 0 0,1 12,7M5.5,8A2.5,2.5 0 0,0 3,10.5C3,11.44 3.53,12.25 4.29,12.68C4.65,12.88 5.06,13 5.5,13C5.94,13 6.35,12.88 6.71,12.68C7.08,12.47 7.39,12.17 7.62,11.81C6.89,10.86 6.5,9.7 6.5,8.5C6.5,8.41 6.5,8.31 6.5,8.22C6.2,8.08 5.86,8 5.5,8M18.5,8C18.14,8 17.8,8.08 17.5,8.22C17.5,8.31 17.5,8.41 17.5,8.5C17.5,9.7 17.11,10.86 16.38,11.81C16.5,12 16.63,12.15 16.78,12.3C16.94,12.45 17.1,12.58 17.29,12.68C17.65,12.88 18.06,13 18.5,13C18.94,13 19.35,12.88 19.71,12.68C20.47,12.25 21,11.44 21,10.5A2.5,2.5 0 0,0 18.5,8M12,14C9.66,14 5,15.17 5,17.5V19H19V17.5C19,15.17 14.34,14 12,14M4.71,14.55C2.78,14.78 0,15.76 0,17.5V19H3V17.07C3,16.06 3.69,15.22 4.71,14.55M19.29,14.55C20.31,15.22 21,16.06 21,17.07V19H24V17.5C24,15.76 21.22,14.78 19.29,14.55M12,16C13.53,16 15.24,16.5 16.23,17H7.77C8.76,16.5 10.47,16 12,16Z"
                        />
                      </Icon>
                    </Circle>
                    <Box>
                      <Heading size="sm">Increase Demo-to-Close Rate</Heading>
                      <Badge colorScheme="green" mt={1}>+15% Close Rate</Badge>
                    </Box>
                  </Flex>
                  <Text fontSize="sm" mb={3}>Send personalized recap emails within 2 hours of demos to improve close rates by 15%. AI analysis shows only 28% of your demos are followed by timely recaps.</Text>
                  <Flex justifyContent="space-between" alignItems="center">
                    <HStack>
                      <Icon viewBox="0 0 24 24" color="blue.500" boxSize={4}>
                        <path
                          fill="currentColor"
                          d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9A3,3 0 0,1 15,12M12,11.26C11.5,11.26 11.26,11.5 11.26,12C11.26,12.5 11.5,12.74 12,12.74C12.5,12.74 12.74,12.5 12.74,12C12.74,11.5 12.5,11.26 12,11.26Z"
                        />
                      </Icon>
                      <Text fontSize="xs" fontWeight="bold" color="blue.500">Estimated Annual Impact: $68,200</Text>
                    </HStack>
                    <Button size="sm" colorScheme="blue" rightIcon={<Icon viewBox="0 0 24 24" boxSize={4}>
                      <path fill="currentColor" d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z" />
                    </Icon>}>
                      Implement
                    </Button>
                  </Flex>
                </Box>
              </MotionCard>

              <MotionCard
                variants={itemVariants}
                p={0}
                borderRadius="md"
                overflow="hidden"
                boxShadow="sm"
                borderLeft="4px solid"
                borderColor="green.500"
                _hover={{ 
                  transform: 'translateY(-2px)', 
                  boxShadow: 'md',
                  transition: 'all 0.2s ease'
                }}
              >
                <Box p={4}>
                  <Flex alignItems="center" mb={3}>
                    <Circle size="40px" bg="green.100" color="green.500" mr={3}>
                      <Icon viewBox="0 0 24 24" boxSize={5}>
                        <path
                          fill="currentColor"
                          d="M21,8V6H7V8H21M21,16V11H7V16H21M21,18V20H7V18H21M3,20V18H5V20H3M3,11V16H5V11H3M3,6V8H5V6H3Z"
                        />
                      </Icon>
                    </Circle>
                    <Box>
                      <Heading size="sm">Segment Enterprise Prospects</Heading>
                      <Badge colorScheme="green" mt={1}>+35% Deal Size</Badge>
                    </Box>
                  </Flex>
                  <Text fontSize="sm" mb={3}>Create a dedicated enterprise sequence with executive-level messaging. Companies with 500+ employees respond better to ROI and strategic value propositions.</Text>
                  <Flex justifyContent="space-between" alignItems="center">
                    <HStack>
                      <Icon viewBox="0 0 24 24" color="green.500" boxSize={4}>
                        <path
                          fill="currentColor"
                          d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9A3,3 0 0,1 15,12M12,11.26C11.5,11.26 11.26,11.5 11.26,12C11.26,12.5 11.5,12.74 12,12.74C12.5,12.74 12.74,12.5 12.74,12C12.74,11.5 12.5,11.26 12,11.26Z"
                        />
                      </Icon>
                      <Text fontSize="xs" fontWeight="bold" color="green.500">Estimated Annual Impact: $125,000</Text>
                    </HStack>
                    <Button size="sm" colorScheme="green" rightIcon={<Icon viewBox="0 0 24 24" boxSize={4}>
                      <path fill="currentColor" d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z" />
                    </Icon>}>
                      Implement
                    </Button>
                  </Flex>
                </Box>
              </MotionCard>
            </Stack>
          </CardBody>
        </MotionCard>

        {/* MaxAgent Chat Integration */}
        <MotionCard 
          variants={itemVariants}
          bg={bgCard}
          borderRadius="lg"
          boxShadow="md"
          overflow="hidden"
          minH="300px"
        >
          <CardHeader bg="blue.600" py={3}>
            <Flex alignItems="center" justifyContent="space-between">
              <HStack>
                <Icon viewBox="0 0 24 24" color="white" boxSize={5}>
                  <path
                    fill="currentColor"
                    d="M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M12,20C7.58,20 4,16.42 4,12C4,7.58 7.58,4 12,4C16.42,4 20,7.58 20,12C20,16.42 16.42,20 12,20M13,9.94L14.06,11L15.12,9.94L16.18,11L17.24,9.94L15.12,7.82L13,9.94M8.88,9.94L9.94,11L11,9.94L8.88,7.82L6.76,9.94L7.82,11L8.88,9.94M12,17.5C14.33,17.5 16.31,16.04 17.11,14H6.89C7.69,16.04 9.67,17.5 12,17.5Z"
                  />
                </Icon>
                <Heading as="h3" size="md" color="white">MAX AI Agent</Heading>
              </HStack>
              <Badge colorScheme="green" variant="solid">
                <HStack spacing={1}>
                  <Icon viewBox="0 0 24 24" boxSize={3}>
                    <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z" />
                  </Icon>
                  <Text>Connected</Text>
                </HStack>
              </Badge>
            </Flex>
          </CardHeader>
          <CardBody>
            <Flex direction="column" h="100%">
              <Box flex="1" mb={4} p={3} bg={bgInsight} borderRadius="md" maxH="150px" overflowY="auto">
                <Text fontSize="sm" fontWeight="bold" mb={2} color="blue.600">Recent Conversations</Text>
                <VStack align="stretch" spacing={2}>
                  <HStack justifyContent="space-between">
                    <Text fontSize="xs">Lead qualification for Acme Corp</Text>
                    <Badge size="sm" colorScheme="green">Completed</Badge>
                  </HStack>
                  <HStack justifyContent="space-between">
                    <Text fontSize="xs">Meeting prep with TechGiant CEO</Text>
                    <Badge size="sm" colorScheme="blue">In Progress</Badge>
                  </HStack>
                  <HStack justifyContent="space-between">
                    <Text fontSize="xs">Contract review for NewVenture</Text>
                    <Badge size="sm" colorScheme="purple">Scheduled</Badge>
                  </HStack>
                </VStack>
              </Box>
              <Button 
                colorScheme="blue" 
                size="lg" 
                leftIcon={
                  <Icon viewBox="0 0 24 24" boxSize={5}>
                    <path
                      fill="currentColor"
                      d="M12,3C17.5,3 22,6.58 22,11C22,15.42 17.5,19 12,19C10.76,19 9.57,18.82 8.47,18.5C5.55,21 2,21 2,21C4.33,18.67 4.7,17.1 4.75,16.5C3.05,15.07 2,13.13 2,11C2,6.58 6.5,3 12,3M17,12V10H15V12H17M13,12V10H11V12H13M9,12V10H7V12H9Z"
                    />
                  </Icon>
                }
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                  transition: 'all 0.2s ease'
                }}
              >
                Chat with MAX Agent
              </Button>
            </Flex>
          </CardBody>
        </MotionCard>
      </SimpleGrid>
    </Box>
  );
};

export default PipelineAI;
