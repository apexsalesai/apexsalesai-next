import React from 'react';

// Simple heatmap component for ROI visualization
const ROIHeatmap = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Mock data for heatmap cells (value between 0-1 representing intensity)
  const heatmapData = [
    [0.2, 0.4, 0.8, 0.9, 0.7, 0.5, 0.3],
    [0.1, 0.3, 0.5, 0.8, 0.9, 0.6, 0.4],
    [0.3, 0.5, 0.7, 0.9, 0.8, 0.6, 0.2],
    [0.4, 0.6, 0.8, 0.7, 0.5, 0.3, 0.1],
  ];
  
  // Labels for rows and columns
  const rowLabels = ['Email Campaigns', 'Lead Nurturing', 'Meeting Scheduling', 'Deal Closing'];
  const colLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <Box 
      bg={bgColor} 
      p={4} 
      borderRadius="md" 
      borderWidth={1} 
      borderColor={borderColor}
      mb={4}
    >
      <Heading size="sm" mb={3}>AI Agent Activity Heatmap</Heading>
      
      <Flex mb={2}>
        <Box w="120px"></Box>
        {colLabels.map((day, i) => (
          <Box key={i} flex={1} textAlign="center" fontSize="xs" fontWeight="medium">
            {day}
          </Box>
        ))}
      </Flex>
      
      {heatmapData.map((row, rowIndex) => (
        <Flex key={rowIndex} mb={1} align="center">
          <Box w="120px" fontSize="xs" pr={2}>
            {rowLabels[rowIndex]}
          </Box>
          {row.map((value, colIndex) => (
            <Box 
              key={colIndex} 
              flex={1} 
              h="24px" 
              mx={0.5}
              bg={`blue.${Math.floor(value * 900)}`}
              borderRadius="sm"
              opacity={0.2 + (value * 0.8)}
            />
          ))}
        </Flex>
      ))}
    </Box>
  );
};

// ROI metrics widget
const ROIMetric = ({ label, value, subtext }: { label: string, value: string, subtext: string }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Box 
      bg={bgColor} 
      p={3} 
      borderRadius="md" 
      borderWidth={1} 
      borderColor={borderColor}
      flex={1}
    >
      <Text fontSize="sm" color="gray.500" mb={1}>{label}</Text>
      <Text fontSize="xl" fontWeight="bold">{value}</Text>
      <Text fontSize="xs" color="gray.500">{subtext}</Text>
    </Box>
  );
};

// Main AgentROIPanel component
const AgentROIPanel = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
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
      <Heading size="md" mb={4}>Agent ROI & Performance</Heading>
      
      {/* ROI Metrics */}
      <Flex gap={3} mb={5}>
        <ROIMetric 
          label="Time Saved" 
          value="42.5 hrs" 
          subtext="This month" 
        />
        <ROIMetric 
          label="Revenue Impact" 
          value="$24,800" 
          subtext="+15% vs last month" 
        />
        <ROIMetric 
          label="Cost Efficiency" 
          value="8.3x" 
          subtext="ROI multiplier" 
        />
        <ROIMetric 
          label="Lead Response" 
          value="3.2 min" 
          subtext="Avg. response time" 
        />
      </Flex>
      
      {/* Heatmap */}
      <ROIHeatmap />
    </Box>
  );
};

export default AgentROIPanel;
