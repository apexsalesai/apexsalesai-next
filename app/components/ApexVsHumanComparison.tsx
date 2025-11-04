import React from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  Badge,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  Divider,
  Tooltip,
} from '@chakra-ui/react';
import { Radar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
  ChartTooltip,
  Legend
);

// Define the type for performance metrics
interface PerformanceMetric {
  category: string;
  apexScore: number;
  humanScore: number;
  improvement: number;
}

// Define the type for time savings
interface TimeSavings {
  activity: string;
  humanMinutes: number;
  apexMinutes: number;
  savingsPercentage: number;
}

// Define the type for action distribution
interface ActionDistribution {
  category: string;
  apexCount: number;
  humanCount: number;
}

// Define props for the TimeSavingsRow component
interface TimeSavingsRowProps {
  activity: TimeSavings;
}

// Create a separate component for time savings rows to avoid hook order issues
const TimeSavingsRow: React.FC<TimeSavingsRowProps> = ({ activity }) => {
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
  
  return (
    <Tooltip 
      label={`${activity.savingsPercentage.toFixed(1)}% time reduction`}
    >
      <Box 
        as="tr" 
        _hover={{ bg: hoverBgColor }}
      >
        <Box as="td" py={2}>{activity.activity}</Box>
        <Box as="td" textAlign="right" py={2}>{activity.humanMinutes} min</Box>
        <Box as="td" textAlign="right" py={2}>{activity.apexMinutes} min</Box>
        <Box 
          as="td" 
          textAlign="right" 
          py={2} 
          color={activity.savingsPercentage > 0 ? 'green.500' : 'red.500'}
        >
          {activity.savingsPercentage > 0 ? '-' : '+'}
          {activity.savingsPercentage.toFixed(1)}%
        </Box>
      </Box>
    </Tooltip>
  );
};

interface ApexVsHumanComparisonProps {
  performanceMetrics: PerformanceMetric[];
  timeSavings: TimeSavings[];
  actionDistribution: ActionDistribution[];
  isLoading?: boolean;
}

const ApexVsHumanComparison: React.FC<ApexVsHumanComparisonProps> = ({
  performanceMetrics = [],
  timeSavings = [],
  actionDistribution = [],
  isLoading = false,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const apexColor = useColorModeValue('blue.500', 'blue.300');
  const humanColor = useColorModeValue('gray.500', 'gray.400');
  const accentColor = useColorModeValue('green.500', 'green.300');

  // Calculate overall metrics
  const averageImprovement = performanceMetrics.length > 0
    ? performanceMetrics.reduce((sum, metric) => sum + metric.improvement, 0) / performanceMetrics.length
    : 0;

  const totalTimeSaved = timeSavings.reduce((sum, activity) => {
    return sum + (activity.humanMinutes - activity.apexMinutes);
  }, 0);

  const totalApexActions = actionDistribution.reduce((sum, action) => sum + action.apexCount, 0);
  const totalHumanActions = actionDistribution.reduce((sum, action) => sum + action.humanCount, 0);
  const totalActions = totalApexActions + totalHumanActions;
  const apexPercentage = totalActions > 0 ? (totalApexActions / totalActions) * 100 : 0;

  // Prepare radar chart data for performance comparison
  const radarData = {
    labels: performanceMetrics.map(metric => metric.category),
    datasets: [
      {
        label: 'Apex AI',
        data: performanceMetrics.map(metric => metric.apexScore),
        backgroundColor: `${apexColor}33`,
        borderColor: apexColor,
        borderWidth: 2,
        pointBackgroundColor: apexColor,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: apexColor,
      },
      {
        label: 'Human Only',
        data: performanceMetrics.map(metric => metric.humanScore),
        backgroundColor: `${humanColor}33`,
        borderColor: humanColor,
        borderWidth: 2,
        pointBackgroundColor: humanColor,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: humanColor,
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          display: false,
        },
        pointLabels: {
          color: textColor,
        },
        grid: {
          color: borderColor,
        },
        angleLines: {
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
    },
  };

  // Prepare doughnut chart data for action distribution
  const doughnutData = {
    labels: ['Apex AI Actions', 'Human Actions'],
    datasets: [
      {
        data: [totalApexActions, totalHumanActions],
        backgroundColor: [apexColor, humanColor],
        borderColor: [apexColor, humanColor],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: textColor,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
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
        <Heading size="md" color={textColor}>Apex AI vs. Human Performance</Heading>
        <Badge colorScheme="green" p={2} borderRadius="md">
          {averageImprovement > 0 ? `${averageImprovement.toFixed(1)}% Average Improvement` : 'Performance Analysis'}
        </Badge>
      </Flex>

      {isLoading ? (
        <Flex justifyContent="center" alignItems="center" height="300px">
          <Text>Loading performance comparison data...</Text>
        </Flex>
      ) : performanceMetrics.length === 0 ? (
        <Flex justifyContent="center" alignItems="center" height="300px">
          <Text>No performance comparison data available</Text>
        </Flex>
      ) : (
        <>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
            <Stat>
              <StatLabel>Performance Improvement</StatLabel>
              <StatNumber color={accentColor}>{averageImprovement.toFixed(1)}%</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                vs. human-only process
              </StatHelpText>
            </Stat>
            
            <Stat>
              <StatLabel>Time Saved</StatLabel>
              <StatNumber color={accentColor}>{totalTimeSaved} min</StatNumber>
              <StatHelpText>
                <StatArrow type="decrease" />
                per transaction cycle
              </StatHelpText>
            </Stat>
            
            <Stat>
              <StatLabel>AI Automation</StatLabel>
              <StatNumber color={accentColor}>{apexPercentage.toFixed(1)}%</StatNumber>
              <StatHelpText>
                of total actions performed
              </StatHelpText>
            </Stat>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {/* Performance Radar Chart */}
            <Box height="300px" position="relative">
              <Text fontSize="sm" fontWeight="medium" mb={2}>Performance by Category</Text>
              <Radar data={radarData} options={radarOptions} />
            </Box>

            {/* Action Distribution */}
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>Action Distribution</Text>
              <Flex height="200px">
                <Box width="100%" height="100%">
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                </Box>
              </Flex>
              
              <Divider my={4} />
              
              {/* Time Savings Table */}
              <Text fontSize="sm" fontWeight="medium" mb={2}>Time Savings by Activity</Text>
              <Box overflowX="auto">
                <Box as="table" width="100%" fontSize="sm">
                  <Box as="thead">
                    <Box as="tr">
                      <Box as="th" textAlign="left" py={2}>Activity</Box>
                      <Box as="th" textAlign="right" py={2}>Human</Box>
                      <Box as="th" textAlign="right" py={2}>Apex AI</Box>
                      <Box as="th" textAlign="right" py={2}>Savings</Box>
                    </Box>
                  </Box>
                  <Box as="tbody">
                    {timeSavings.map((activity, index) => (
                      <TimeSavingsRow key={index} activity={activity} />
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </SimpleGrid>
        </>
      )}
    </Box>
  );
};

export default ApexVsHumanComparison;
