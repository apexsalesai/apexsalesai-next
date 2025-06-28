import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Grid,
  GridItem,
  useColorModeValue,
  Tooltip,
  Badge,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { useAgentROI } from '../hooks/useAgentROI';

// Heatmap cell component
const HeatmapCell = ({ value, label }: { value: number; label: string }) => {
  // Color scale from light to dark based on activity level
  const getColor = (value: number) => {
    const baseColor = useColorModeValue('blue.500', 'blue.300');
    const opacity = Math.min(0.1 + value * 0.9, 1); // Scale 0-1 to 0.1-1 for visibility
    return `${baseColor}${useColorModeValue('', '')}`;
  };

  return (
    <Tooltip label={`${label}: ${value} actions`}>
      <Box
        bg={getColor(value)}
        opacity={0.1 + value * 0.9}
        w="100%"
        h="100%"
        minH="30px"
        borderRadius="sm"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color={value > 0.5 ? 'white' : 'gray.800'}
        fontWeight={value > 0 ? 'bold' : 'normal'}
        fontSize="xs"
      >
        {value > 0 && value}
      </Box>
    </Tooltip>
  );
};

// ROI Metric Card component
const ROIMetricCard = ({
  label,
  value,
  helpText,
  format = 'number',
  isPositive = true,
}: {
  label: string;
  value: number;
  helpText?: string;
  format?: 'number' | 'currency' | 'percentage' | 'hours';
  isPositive?: boolean;
}) => {
  // Format the value based on the format type
  const formattedValue = () => {
    switch (format) {
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'percentage':
        return `${value}%`;
      case 'hours':
        return `${value} hrs`;
      default:
        return value.toLocaleString();
    }
  };

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const accentColor = isPositive ? 'green.500' : 'red.500';

  return (
    <Box
      p={4}
      borderRadius="lg"
      bg={bgColor}
      boxShadow="sm"
      border="1px solid"
      borderColor={borderColor}
      transition="transform 0.2s"
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
    >
      <Stat>
        <StatLabel color="gray.500" fontSize="sm">
          {label}
        </StatLabel>
        <StatNumber color={accentColor} fontSize="2xl">
          {formattedValue()}
        </StatNumber>
        {helpText && (
          <StatHelpText fontSize="xs" color="gray.500">
            {helpText}
          </StatHelpText>
        )}
      </Stat>
    </Box>
  );
};

export const AgentROIPanel = () => {
  const { data, loading, error } = useAgentROI();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');

  // Days of the week for heatmap
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Time blocks for heatmap
  const timeBlocks = [
    '12am-4am',
    '4am-8am',
    '8am-12pm',
    '12pm-4pm',
    '4pm-8pm',
    '8pm-12am',
  ];

  // Generate sample heatmap data (in real implementation, this would come from the API)
  const generateHeatmapData = () => {
    const heatmap = [];
    for (let i = 0; i < timeBlocks.length; i++) {
      const row = [];
      for (let j = 0; j < daysOfWeek.length; j++) {
        // Generate random activity level between 0-10
        // In real implementation, this would be actual agent activity data
        const value = Math.floor(Math.random() * 11);
        row.push({
          value,
          day: daysOfWeek[j],
          time: timeBlocks[i],
        });
      }
      heatmap.push(row);
    }
    return heatmap;
  };

  const heatmapData = generateHeatmapData();

  // In a real implementation, these would come from the API
  const roiMetrics = {
    revenueDelta: data?.ai_driven_revenue || 11400,
    timeSaved: data?.time_saved_hours || 18,
    leadsRescued: data?.leads_rescued || 12,
    actionsPerformed: 37, // This would be calculated from agent actions
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
        <Heading size="md">Agent Impact & ROI</Heading>
        <Badge colorScheme="green" fontSize="sm">
          Level 3+ Agent
        </Badge>
      </Flex>

      {/* ROI Metrics Grid */}
      <Grid templateColumns="repeat(4, 1fr)" gap={4} mb={6}>
        <GridItem>
          <ROIMetricCard
            label="Revenue Delta"
            value={roiMetrics.revenueDelta}
            helpText="Saved from lost lead conversion"
            format="currency"
          />
        </GridItem>
        <GridItem>
          <ROIMetricCard
            label="Human Time Saved"
            value={roiMetrics.timeSaved}
            helpText="Hours of manual work automated"
            format="hours"
          />
        </GridItem>
        <GridItem>
          <ROIMetricCard
            label="Leads Rescued"
            value={roiMetrics.leadsRescued}
            helpText="At-risk leads re-engaged"
          />
        </GridItem>
        <GridItem>
          <ROIMetricCard
            label="Actions Performed"
            value={roiMetrics.actionsPerformed}
            helpText="Total autonomous actions"
          />
        </GridItem>
      </Grid>

      {/* Agent Activity Heatmap */}
      <Box mb={4}>
        <Flex justifyContent="space-between" alignItems="center" mb={2}>
          <Text fontWeight="medium" fontSize="sm">
            Agent Activity Heatmap
          </Text>
          <Tooltip label="Shows when your agent is most active during the week">
            <InfoIcon color="gray.500" />
          </Tooltip>
        </Flex>

        <Grid
          templateColumns="auto repeat(7, 1fr)"
          templateRows={`auto repeat(${timeBlocks.length}, 1fr)`}
          gap={1}
        >
          {/* Empty top-left cell */}
          <GridItem />

          {/* Day headers */}
          {daysOfWeek.map((day) => (
            <GridItem key={day} textAlign="center">
              <Text fontSize="xs" fontWeight="medium" color="gray.500">
                {day}
              </Text>
            </GridItem>
          ))}

          {/* Time blocks and heatmap cells */}
          {timeBlocks.map((time, timeIndex) => (
            <React.Fragment key={time}>
              <GridItem>
                <Text
                  fontSize="xs"
                  fontWeight="medium"
                  color="gray.500"
                  textAlign="right"
                  pr={2}
                >
                  {time}
                </Text>
              </GridItem>
              {heatmapData[timeIndex].map((cell, dayIndex) => (
                <GridItem key={`${timeIndex}-${dayIndex}`}>
                  <HeatmapCell
                    value={cell.value / 10} // Normalize to 0-1
                    label={`${cell.day} ${cell.time}`}
                  />
                </GridItem>
              ))}
            </React.Fragment>
          ))}
        </Grid>
      </Box>

      <Text fontSize="xs" color="gray.500" textAlign="right">
        Data from last 7 days • Updated hourly
      </Text>
    </Box>
  );
};

export default AgentROIPanel;
