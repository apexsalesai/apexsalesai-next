import React from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  Badge,
  useColorModeValue,
  Tooltip,
  HStack,
} from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

// Define the type for lead lifecycle stage
interface LeadStageData {
  stage: string;
  count: number;
  conversionRate: number;
  aiAssisted: boolean;
}

// Define the type for lead lifecycle over time
interface LeadTimelineData {
  date: string;
  newLeads: number;
  qualifiedLeads: number;
  opportunities: number;
  closedWon: number;
}

interface LeadLifecycleVisualizationProps {
  stageData: LeadStageData[];
  timelineData: LeadTimelineData[];
  isLoading?: boolean;
}

const LeadLifecycleVisualization: React.FC<LeadLifecycleVisualizationProps> = ({
  stageData = [],
  timelineData = [],
  isLoading = false,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const primaryColor = useColorModeValue('blue.500', 'blue.300');
  const secondaryColor = useColorModeValue('green.500', 'green.300');
  const tertiaryColor = useColorModeValue('purple.500', 'purple.300');
  const quaternaryColor = useColorModeValue('orange.500', 'orange.300');

  // Calculate funnel metrics
  const totalLeads = stageData.length > 0 ? stageData[0].count : 0;
  const closedWon = stageData.length > 0 ? stageData[stageData.length - 1].count : 0;
  const overallConversion = totalLeads > 0 ? (closedWon / totalLeads) * 100 : 0;
  
  // Find the stage with the highest drop-off
  let highestDropoff = { stage: '', dropoff: 0, fromStage: '' };
  for (let i = 1; i < stageData.length; i++) {
    const dropoff = stageData[i-1].count - stageData[i].count;
    const dropoffRate = stageData[i-1].count > 0 ? dropoff / stageData[i-1].count : 0;
    
    if (dropoffRate > highestDropoff.dropoff) {
      highestDropoff = {
        stage: stageData[i].stage,
        dropoff: dropoffRate,
        fromStage: stageData[i-1].stage
      };
    }
  }

  // Prepare timeline chart data
  const timelineChartData = {
    labels: timelineData.map(data => data.date),
    datasets: [
      {
        label: 'New Leads',
        data: timelineData.map(data => data.newLeads),
        borderColor: primaryColor,
        backgroundColor: `${primaryColor}33`,
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Qualified Leads',
        data: timelineData.map(data => data.qualifiedLeads),
        borderColor: secondaryColor,
        backgroundColor: `${secondaryColor}33`,
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Opportunities',
        data: timelineData.map(data => data.opportunities),
        borderColor: tertiaryColor,
        backgroundColor: `${tertiaryColor}33`,
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Closed Won',
        data: timelineData.map(data => data.closedWon),
        borderColor: quaternaryColor,
        backgroundColor: `${quaternaryColor}33`,
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const timelineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Leads',
          color: textColor,
        },
        ticks: {
          color: textColor,
        },
        grid: {
          color: borderColor,
        },
      },
      x: {
        ticks: {
          color: textColor,
        },
        grid: {
          color: borderColor,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: textColor,
        },
      },
      title: {
        display: true,
        text: 'Lead Lifecycle Timeline',
        color: textColor,
        font: {
          size: 16,
        },
      },
    },
  };

  // Define non-AI stage color outside of the render function
  const nonAiStageColor = useColorModeValue('gray.400', 'gray.600');

  // Create a separate component for each funnel stage to avoid hook order issues
interface FunnelStageProps {
  stage: LeadStageData;
  index: number;
  totalStages: number;
  primaryColor: string;
  textColor: string;
}

const FunnelStage: React.FC<FunnelStageProps> = ({ 
  stage, 
  index, 
  totalStages,
  primaryColor,
  textColor
}) => {
  const nonAiStageColor = useColorModeValue('gray.400', 'gray.600');
  
  // Calculate width for funnel effect - start wide, end narrow
  const width = 100 - (index * (100 / totalStages) / 2);
  
  // Use different colors for AI-assisted stages
  const backgroundColor = stage.aiAssisted ? primaryColor : nonAiStageColor;
  
  return (
    <Box position="relative" width="100%" mb={1}>
      <Tooltip 
        label={`${stage.stage}: ${stage.count} leads (${stage.conversionRate.toFixed(1)}% conversion from previous stage)`}
        placement="right"
      >
        <Box
          height="40px"
          width={`${width}%`}
          bg={backgroundColor}
          borderRadius="md"
          mx="auto"
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
          _after={{
            content: '""',
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: `10px solid ${backgroundColor}`,
            display: index < totalStages - 1 ? 'block' : 'none',
          }}
        >
          <Text color="white" fontWeight="bold">
            {stage.stage}: {stage.count}
          </Text>
        </Box>
      </Tooltip>
      
      {index < totalStages - 1 && (
        <Text 
          position="absolute" 
          right="5%" 
          bottom="-25px" 
          fontSize="xs" 
          color={textColor}
          zIndex={1}
        >
          {stage.conversionRate.toFixed(1)}%
        </Text>
      )}
    </Box>
  );
};

// Create the funnel visualization using the FunnelStage component
const renderFunnel = () => {
  return (
    <Flex direction="column" w="100%" maxW="600px" mx="auto" mt={4} mb={8}>
      {stageData.map((stage, index) => (
        <FunnelStage
          key={stage.stage}
          stage={stage}
          index={index}
          totalStages={stageData.length}
          primaryColor={primaryColor}
          textColor={textColor}
        />
      ))}
    </Flex>
  );
};

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      boxShadow="md"
      p={4}
      borderWidth="1px"
      borderColor={borderColor}
    >
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="md" color={textColor}>Lead Lifecycle Analysis</Heading>
        <Badge colorScheme="blue" p={2} borderRadius="md">
          Overall Conversion: {overallConversion.toFixed(1)}%
        </Badge>
      </Flex>

      {isLoading ? (
        <Flex justifyContent="center" alignItems="center" height="300px">
          <Text>Loading lead lifecycle data...</Text>
        </Flex>
      ) : stageData.length === 0 ? (
        <Flex justifyContent="center" alignItems="center" height="300px">
          <Text>No lead lifecycle data available</Text>
        </Flex>
      ) : (
        <>
          <HStack spacing={4} mb={4} justify="space-between">
            <Box>
              <Text fontSize="sm" color="gray.500">Total Leads</Text>
              <Text fontWeight="bold" color={primaryColor}>{totalLeads}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">Closed Won</Text>
              <Text fontWeight="bold" color={quaternaryColor}>{closedWon}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">Highest Drop-off</Text>
              <Text fontWeight="bold" color="red.500">
                {highestDropoff.fromStage} → {highestDropoff.stage}
              </Text>
            </Box>
          </HStack>

          {/* Funnel Visualization */}
          <Box mb={8}>
            <Text fontSize="sm" mb={2} fontWeight="medium">Lead Conversion Funnel</Text>
            {renderFunnel()}
          </Box>

          {/* Timeline Chart */}
          <Box height="300px">
            <Line data={timelineChartData} options={timelineChartOptions} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default LeadLifecycleVisualization;
