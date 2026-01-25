import React from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  Badge,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

// Define the type for agent ROI data
interface AgentROIData {
  name: string;
  revenue: number;
  cost: number;
  deals: number;
  roi: number;
}

interface AgentROITrackerProps {
  agentData: AgentROIData[];
  isLoading?: boolean;
}

const AgentROITracker: React.FC<AgentROITrackerProps> = ({ 
  agentData = [], 
  isLoading = false 
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const accentColor = useColorModeValue('blue.500', 'blue.300');
  
  // Prepare chart data
  const chartData = {
    labels: agentData.map(agent => agent.name),
    datasets: [
      {
        label: 'Revenue Generated ($)',
        data: agentData.map(agent => agent.revenue),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'ROI (%)',
        data: agentData.map(agent => agent.roi * 100), // Convert to percentage
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        // Use a secondary y-axis for ROI percentage
        yAxisID: 'y1',
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Revenue ($)',
          color: textColor,
        },
        ticks: {
          color: textColor,
        },
        grid: {
          color: borderColor,
        },
      },
      y1: {
        beginAtZero: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'ROI (%)',
          color: textColor,
        },
        ticks: {
          color: textColor,
        },
        grid: {
          drawOnChartArea: false,
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
        text: 'Agent Performance & ROI',
        color: textColor,
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.raw;
            
            if (label === 'ROI (%)') {
              return `${label}: ${value.toFixed(1)}%`;
            }
            return `${label}: $${value.toLocaleString()}`;
          }
        }
      }
    },
  };

  // Calculate top performer
  const topPerformer = agentData.length > 0 
    ? agentData.reduce((prev, current) => (prev.roi > current.roi) ? prev : current) 
    : null;

  // Calculate average ROI
  const averageROI = agentData.length > 0 
    ? agentData.reduce((sum, agent) => sum + agent.roi, 0) / agentData.length 
    : 0;

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
        <Heading size="md" color={textColor}>Agent ROI Tracker</Heading>
        {topPerformer && (
          <Tooltip label={`${topPerformer.name} has the highest ROI at ${(topPerformer.roi * 100).toFixed(1)}%`}>
            <Badge colorScheme="green" p={2} borderRadius="md">
              Top Performer: {topPerformer.name}
            </Badge>
          </Tooltip>
        )}
      </Flex>

      {isLoading ? (
        <Flex justifyContent="center" alignItems="center" height="300px">
          <Text>Loading agent performance data...</Text>
        </Flex>
      ) : agentData.length === 0 ? (
        <Flex justifyContent="center" alignItems="center" height="300px">
          <Text>No agent performance data available</Text>
        </Flex>
      ) : (
        <>
          <Box height="300px" mb={4}>
            <Bar data={chartData} options={chartOptions} />
          </Box>
          
          <Flex justifyContent="space-between" mt={2}>
            <Box>
              <Text fontSize="sm" color="gray.500">Total Agents</Text>
              <Text fontWeight="bold" color={accentColor}>{agentData.length}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">Average ROI</Text>
              <Text fontWeight="bold" color={accentColor}>{(averageROI * 100).toFixed(1)}%</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">Total Revenue</Text>
              <Text fontWeight="bold" color={accentColor}>
                ${agentData.reduce((sum, agent) => sum + agent.revenue, 0).toLocaleString()}
              </Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">Total Deals</Text>
              <Text fontWeight="bold" color={accentColor}>
                {agentData.reduce((sum, agent) => sum + agent.deals, 0)}
              </Text>
            </Box>
          </Flex>
        </>
      )}
    </Box>
  );
};

export default AgentROITracker;
